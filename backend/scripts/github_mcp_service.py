"""
GitHub MCP Service for Python agents
All GitHub actions should use this service, which wraps MCP API calls.
Update MCP_BASE_URL and authentication as needed for your environment.
"""

from typing import Any, Dict, Optional

import requests  # type: ignore

MCP_BASE_URL = "http://localhost:4001"  # Update if MCP server runs elsewhere


class GitHubMCPService:
    def __init__(self, mcp_base_url: str = MCP_BASE_URL):
        self.base_url = mcp_base_url.rstrip("/")

    def create_issue(
        self,
        owner: str,
        repo: str,
        title: str,
        body: str = "",
        assignees: Optional[list] = None,
        labels: Optional[list] = None,
    ) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "owner": owner,
            "repo": repo,
            "title": title,
            "body": body,
        }
        if assignees:
            payload["assignees"] = assignees  # type: ignore
        if labels:
            payload["labels"] = labels  # type: ignore
        resp = requests.post(f"{self.base_url}/github/issue", json=payload)
        resp.raise_for_status()
        return resp.json()

    def create_pull_request(
        self, owner: str, repo: str, title: str, body: str, head: str, base: str
    ) -> Dict[str, Any]:
        payload = {
            "owner": owner,
            "repo": repo,
            "title": title,
            "body": body,
            "head": head,
            "base": base,
        }
        resp = requests.post(f"{self.base_url}/github/pull_request", json=payload)
        resp.raise_for_status()
        return resp.json()

    def comment_on_issue(
        self, owner: str, repo: str, issue_number: int, comment: str
    ) -> Dict[str, Any]:
        payload = {
            "owner": owner,
            "repo": repo,
            "issue_number": issue_number,
            "body": comment,
        }
        resp = requests.post(f"{self.base_url}/github/issue_comment", json=payload)
        resp.raise_for_status()
        return resp.json()

    # Add more methods as needed for your workflow


# Example usage:
# mcp = GitHubMCPService()
# mcp.create_issue("mfpop", "rnexus", "Test Issue from MCP", "This was created via MCP service.")
