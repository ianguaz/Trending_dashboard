#!/usr/bin/env python3
"""
Daily data fetcher for GitHub Trending and Product Hunt.
Run: python scripts/fetch_data.py
Requires: PH_API_TOKEN env variable for Product Hunt.
"""

import json
import os
import sys
from datetime import date, datetime, timezone, timedelta

import requests
from bs4 import BeautifulSoup

# Beijing time (UTC+8)
CST = timezone(timedelta(hours=8))
today = datetime.now(CST).strftime("%Y-%m-%d")


def fetch_github(language: str = "", since: str = "daily") -> list:
    """Scrape GitHub Trending page."""
    url = f"https://github.com/trending/{language}?since={since}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    results = []
    for repo in soup.select("article.Box-row")[:20]:
        # Name
        name_tag = repo.select_one("h2 a")
        if not name_tag:
            continue
        name = name_tag["href"].strip("/")

        # Description
        desc_tag = repo.select_one("p")
        desc = desc_tag.text.strip() if desc_tag else ""

        # Total stars
        stars_tag = repo.select_one("a[href$='/stargazers']")
        stars = stars_tag.text.strip().replace(",", "").strip() if stars_tag else "0"

        # Today's stars
        today_tag = repo.select_one("span.d-inline-block.float-sm-right")
        today_stars = today_tag.text.strip() if today_tag else ""

        # Language
        lang_tag = repo.select_one("span[itemprop='programmingLanguage']")
        lang = lang_tag.text.strip() if lang_tag else ""

        results.append({
            "name": name,
            "desc": desc,
            "stars": stars,
            "today": today_stars,
            "language": lang,
            "url": f"https://github.com/{name}",
        })

    return results


def get_ph_access_token(client_id: str, client_secret: str) -> str:
    """Exchange client credentials for an OAuth2 access token."""
    resp = requests.post(
        "https://api.producthunt.com/v2/oauth/token",
        json={
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "client_credentials",
        },
        headers={"Content-Type": "application/json"},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def fetch_producthunt() -> list:
    """Fetch today's top products from Product Hunt GraphQL API."""
    client_id = os.environ.get("PH_API_TOKEN", "")
    client_secret = os.environ.get("PH_API_SECRET", "")
    if not client_id or not client_secret:
        print("WARNING: PH_API_TOKEN or PH_API_SECRET not set, skipping.", file=sys.stderr)
        return []

    token = get_ph_access_token(client_id, client_secret)

    query = """
    {
      posts(first: 20, order: VOTES) {
        edges {
          node {
            name
            tagline
            votesCount
            url
            thumbnail {
              url
            }
            topics {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
    """

    resp = requests.post(
        "https://api.producthunt.com/v2/api/graphql",
        json={"query": query},
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()

    if "errors" in data:
        print(f"Product Hunt API error: {data['errors']}", file=sys.stderr)
        return []

    edges = data["data"]["posts"]["edges"]
    results = []
    for edge in edges:
        node = edge["node"]
        topics = [t["node"]["name"] for t in node.get("topics", {}).get("edges", [])]
        results.append({
            "name": node["name"],
            "desc": node["tagline"],
            "votes": node["votesCount"],
            "url": node["url"],
            "thumbnail": (node.get("thumbnail") or {}).get("url", ""),
            "topics": topics[:3],
        })

    return results


def main():
    print(f"Fetching data for {today} (Beijing time)...")

    # GitHub
    print("  → GitHub Trending...")
    github_items = fetch_github()
    github_data = {"date": today, "items": github_items}
    print(f"     Got {len(github_items)} repos.")

    # Product Hunt
    print("  → Product Hunt...")
    ph_items = fetch_producthunt()
    ph_data = {"date": today, "items": ph_items}
    print(f"     Got {len(ph_items)} products.")

    # Write
    os.makedirs("data", exist_ok=True)
    with open("data/github.json", "w", encoding="utf-8") as f:
        json.dump(github_data, f, ensure_ascii=False, indent=2)
    with open("data/producthunt.json", "w", encoding="utf-8") as f:
        json.dump(ph_data, f, ensure_ascii=False, indent=2)

    print("Done. Files written to data/")


if __name__ == "__main__":
    main()
