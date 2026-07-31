name: querying-massive-financial-data
description: Orchestrates the retrieval of institutional-grade market data, options Greeks, aggregates, SEC filings, and corporate fundamentals via the native Massive (formerly Polygon.io) MCP server.
compatibility: Requires an active SSE connection to the Massive MCP server (mcp.massive.com) and a valid MASSIVE_API_KEY environment variable.
allowed-tools: search_endpoints get_endpoint_docs call_api
metadata:
provider: "Massive.com"
asset_classes: ["Stocks", "Options", "Crypto", "Forex", "Futures", "Indices", "Alternative"]
integration_type: "Native MCP"
