"""Pure invariant tests for the RepliGraph domain vocabulary.

These tests intentionally do not fabricate application records; they verify
the deterministic rules that must also be enforced by the Intelligent Contract.
"""
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
