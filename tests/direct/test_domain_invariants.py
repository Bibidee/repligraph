"""Pure invariant tests for the RepliGraph domain vocabulary and source guards.

These tests intentionally do not fabricate application records; they verify
the deterministic rules that must also be enforced by the Intelligent Contract.
"""
from pathlib import Path
ALLOWED = {"DIRECT_REPLICATION", "MATERIAL_VARIANT", "EXTENSION", "CONTRADICTORY_RESULT", "INCOMPARABLE", "INSUFFICIENT"}

def settle(decision: str, comparable: bool) -> str:
    if decision not in ALLOWED:
        raise ValueError("invalid decision")
    return "INCOMPARABLE" if decision == "CONTRADICTORY_RESULT" and not comparable else decision

def test_contradiction_requires_comparability():
    assert settle("CONTRADICTORY_RESULT", False) == "INCOMPARABLE"
    assert settle("CONTRADICTORY_RESULT", True) == "CONTRADICTORY_RESULT"

def test_similarity_is_not_a_decision():
    assert settle("INSUFFICIENT", True) == "INSUFFICIENT"

def test_search_related_initializes_seen_in_its_own_scope():
    source = (Path(__file__).parents[2] / "contracts" / "repligraph.py").read_text(encoding="utf-8")
    search = source[source.index("    def search_related"):]
    edges = source[source.index("    def list_edges_global"):source.index("    def search_related")]
    assert "seen = set()" in search
    assert "seen = set()" not in edges
    assert "return edge.edge_id" in source

def test_latest_only_semantic_policy_deduplicates_versions_and_fields():
    current = {1: 1, 2: 2}
    pointers = [(2, 1, "QUESTION"), (2, 2, "QUESTION"), (2, 2, "QUESTION"), (2, 2, "METHOD"), (1, 1, "CONCLUSION")]
    seen = set(); result = []
    for study_id, version, field in pointers:
        if version != current[study_id]:
            continue
        identity = (study_id, version, field)
        if identity in seen:
            continue
        seen.add(identity); result.append(identity)
    assert result == [(2, 2, "QUESTION"), (2, 2, "METHOD"), (1, 1, "CONCLUSION")]
