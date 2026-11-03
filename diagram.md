flowchart TD
A[Start] --> B{Fungerer det?}
B -- Ja --> C[Rør det ikke!]
B -- Nej --> D{Har du pillet ved det?}
D -- Ja --> E[Din fjols!]
D -- Nej --> F[Vil du få skylden?]
E --> G[Ved nogen det?]
F -- Ja --> E
F -- Nej --> H[Gem det væk!]
G -- Ja --> E
G -- Nej --> I[Ingen problemer]
C --> I
H --> I
I --> J[Slut]
