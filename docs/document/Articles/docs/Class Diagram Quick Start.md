# Class Diagram Quick Start

## Access Modifiers

Access modifiers are used for marking members only.

- `-`: private
- `+`: public
- `#`: protected 
- `~`: package(for some languages that are not fully object-oriented)

## Relationships

Relationships are used for marking type only.

### Association

`-->` or `<--` or `<-->` for unidirectional and bidirectional. The weakest relationship.

> [!NOTE]
> All relationships except inheritance and implementation can have bidirectional case.

### Inheritance

`<|--`: inheritance from left to right. `Child <|-- Parent` for example. Unidirectional only.

### Aggregation

`o--`: aggregation, type on the right are used inside the type on the left while left is independent. `Car o-- Wheel` for example.

### Composition

`*--`: composition, an extra rule for class diagram that marks the left as a whole and contains the right, both can't be reasonably exists alone, `Human *-- Heart`

### Implementation

`<|..`: the left implements the left interface.
