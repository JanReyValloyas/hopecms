# HopeCMS Entity Relationship Diagram

## Visual Entity Relationship Diagram
*(Note: GitHub and VS Code with Markdown preview will render this automatically as a diagram)*

```mermaid
erDiagram
    %% Core Sales System
    CUSTOMER ||--o{ SALES : "places"
    SALES ||--|{ SALES_DETAIL : "contains line items"
    PRODUCT ||--o{ SALES_DETAIL : "included in"
    PRODUCT ||--o{ PRICE_HIST : "tracks history"

    %% User & Authorization System
    USER ||--o{ USER_MODULE : "assigned to"
    MODULE ||--o{ USER_MODULE : "has access"
    USER_MODULE ||--o{ USERMODULE_RIGHTS : "granted"
    RIGHTS ||--o{ USERMODULE_RIGHTS : "defines access level"
