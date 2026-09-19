# Mahanaim Academy data import guide

The `templates/` folder contains starter CSV templates for the main school records.

## Templates

- `students.csv` — learner identity, class and guardian contact
- `staff.csv` — teaching, administration and support staff
- `parents.csv` — parent/guardian portal relationships
- `fee_structures.csv` — GHS term charges by class or phase
- `results.csv` — Term assessment scores

## Recommended import order

1. Students
2. Staff
3. Parents
4. Fee structures
5. Results

## Data rules

- Keep the first row as the column header.
- Use unique IDs such as `MA-001` for students and `MA-ST-001` for staff.
- Use classes supported by the system: `Creche`, `KG 1`, `KG 2`, `B1` through `B6`, and `JHS 1` through `JHS 3`.
- Keep phone numbers in a consistent Ghana format.
- Enter money amounts as numbers in Ghana cedis without the `GHS` prefix.
- Back up the system before importing changes.

The browser interface supports direct CSV import from **Users & access → Import CSV**. Choose the data type, select the matching template and import the rows. JSON backup and restore are also available for complete school data backups.
