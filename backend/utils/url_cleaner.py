import re
import socket
import datetime
import ipaddress
from turtle import pd
from urllib.parse import urlparse, parse_qs
import pandas as pd

import tldextract
import requests
import whois

try:
    import dns.resolver
    DNS_AVAILABLE = True
except ImportError:
    DNS_AVAILABLE = False


def _safe_network(fn, *args, default=-1):
    try:
        return fn(*args)
    except Exception:
        return default


def _is_ip(hostname):
    try:
        ipaddress.ip_address(hostname)
        return 1
    except ValueError:
        return 0


def _count_vowels(s):
    return sum(1 for c in (s or "") if c.lower() in "aeiou")


def _get_response_time(url):
    r = requests.head(
        url,
        timeout=5,
        allow_redirects=True,
        headers={"User-Agent": "Mozilla/5.0"}
    )
    return r.elapsed.total_seconds()


def _has_spf(domain):
    if not DNS_AVAILABLE:
        return -1

    answers = dns.resolver.resolve(domain, "TXT")
    return int(any("v=spf1" in str(r) for r in answers))


def _get_asn(hostname):
    ip = socket.gethostbyname(hostname)
    r = requests.get(f"https://ipinfo.io/{ip}/json", timeout=5)
    org = r.json().get("org", "")
    m = re.match(r"AS(\d+)", org)
    return int(m.group(1)) if m else -1


def _whois_days(domain):
    w = whois.whois(domain)
    now = datetime.datetime.utcnow()

    def to_dt(v):
        if isinstance(v, list):
            v = v[0]
        if isinstance(v, datetime.datetime):
            return v
        return None

    created = to_dt(w.creation_date)
    expires = to_dt(w.expiration_date)

    activation_days = int((now - created).days) if created else -1
    expiration_days = int((expires - now).days) if expires else -1

    return activation_days, expiration_days


def _qty_ip_resolved(hostname):
    return len(socket.getaddrinfo(hostname, None))


def _qty_nameservers(domain):
    if not DNS_AVAILABLE:
        return -1
    return len(dns.resolver.resolve(domain, "NS"))


def _qty_mx(domain):
    if not DNS_AVAILABLE:
        return -1
    return len(dns.resolver.resolve(domain, "MX"))


def _ttl(hostname):
    if not DNS_AVAILABLE:
        return -1

    ans = dns.resolver.resolve(hostname, "A")
    return ans.rrset.ttl


def _has_tls(parsed):
    return 1 if parsed.scheme.lower() == "https" else 0


def _qty_redirects(url):
    r = requests.get(
        url,
        timeout=8,
        allow_redirects=True,
        headers={"User-Agent": "Mozilla/5.0"}
    )
    return len(r.history)


def _google_indexed(query):
    r = requests.get(
        "https://www.google.com/search",
        params={"q": query},
        headers={"User-Agent": "Mozilla/5.0"},
        timeout=8
    )

    return 0 if "did not match any documents" in r.text else 1


def _is_shortened(url):
    shorteners = {
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "goo.gl",
        "ow.ly",
        "is.gd",
        "buff.ly",
        "adf.ly",
        "short.link",
        "rb.gy"
    }

    ext = tldextract.extract(url)
    root_domain = f"{ext.domain}.{ext.suffix}"

    return int(root_domain in shorteners)


def extract_features(url: str, use_network: bool = True) -> dict:
    if not url.startswith("http"):
        url = "http://" + url

    parsed = urlparse(url)
    ext = tldextract.extract(url)

    hostname = parsed.hostname or ""
    domain = f"{ext.domain}.{ext.suffix}" if ext.suffix else ext.domain

    full_url = url
    domain_part = hostname
    directory_part = "/".join(parsed.path.strip("/").split("/")[:-1])
    file_part = parsed.path.strip("/").split("/")[-1]
    params_str = parsed.query

    special_chars = [
        ".", "-", "_", "/", "?", "=", "@", "&", "!", " ",
        "~", ",", "+", "*", "#", "$", "%"
    ]

    key_names = [
        "dot", "hyphen", "underline", "slash", "questionmark", "equal",
        "at", "and", "exclamation", "space", "tilde", "comma", "plus",
        "asterisk", "hashtag", "dollar", "percent"
    ]

    def segment_features(segment, segment_name):
        return {
            f"qty_{key}_{segment_name}": (
                segment.count(char) if segment is not None else -1
            )
            for key, char in zip(key_names, special_chars)
        }

    features = {}

    features.update(segment_features(full_url, "url"))
    features["qty_tld_url"] = full_url.count(ext.suffix) if ext.suffix else 0
    features["length_url"] = len(full_url)

    features.update(segment_features(domain_part, "domain"))
    features["qty_vowels_domain"] = _count_vowels(domain_part)
    features["domain_length"] = len(domain_part)
    features["domain_in_ip"] = _is_ip(hostname)
    features["server_client_domain"] = int(
        bool(re.search(r"(client|server)", hostname, re.I))
    )

    features.update(segment_features(directory_part or None, "directory"))
    features["directory_length"] = len(directory_part)

    features.update(segment_features(file_part or None, "file"))
    features["file_length"] = len(file_part)

    features.update(segment_features(params_str or None, "params"))
    features["params_length"] = len(params_str)
    features["tld_present_params"] = int(
        bool(re.search(r"\.(com|net|org|info|io)", params_str))
    )
    features["qty_params"] = len(parse_qs(params_str))

    features["email_in_url"] = int(
        bool(re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+", url))
    )

    features["url_shortened"] = _is_shortened(url)

    if use_network:
        features["time_response"] = _safe_network(_get_response_time, url)
        features["domain_spf"] = _safe_network(_has_spf, domain)
        features["asn_ip"] = _safe_network(_get_asn, hostname)

        activation_days, expiration_days = _safe_network(
            _whois_days,
            domain,
            default=(-1, -1)
        )

        features["time_domain_activation"] = activation_days
        features["time_domain_expiration"] = expiration_days
        features["qty_ip_resolved"] = _safe_network(_qty_ip_resolved, hostname)
        features["qty_nameservers"] = _safe_network(_qty_nameservers, domain)
        features["qty_mx_servers"] = _safe_network(_qty_mx, domain)
        features["ttl_hostname"] = _safe_network(_ttl, hostname)
        features["tls_ssl_certificate"] = _has_tls(parsed)
        features["qty_redirects"] = _safe_network(_qty_redirects, url)
        features["url_google_index"] = _safe_network(_google_indexed, url)
        features["domain_google_index"] = _safe_network(_google_indexed, domain)

    else:
        network_columns = [
            "time_response",
            "domain_spf",
            "asn_ip",
            "time_domain_activation",
            "time_domain_expiration",
            "qty_ip_resolved",
            "qty_nameservers",
            "qty_mx_servers",
            "ttl_hostname",
            "qty_redirects",
            "url_google_index",
            "domain_google_index"
        ]

        for col in network_columns:
            features[col] = -1

        features["tls_ssl_certificate"] = _has_tls(parsed)

    return features


def url_to_dataframe(url: str, feature_cols: list, use_network: bool = True):
    raw_features = extract_features(url, use_network=use_network)
    row = {col: raw_features.get(col, -1) for col in feature_cols}
    return pd.DataFrame([row])