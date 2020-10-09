

export const BASE_URI = "http://10.10.1.123:5000"

export const DOCUMENT_TYPES = [
    {
        name: "capital",
        label: "Vermögen",
        fields: [
            {
                label: "Betrag",
                name: "value",
                type: "number"
            }
        ],
    },
    {
        name: "deductions",
        label: "Abzüge",
        fields: [
            {
                label: "Betrag",
                name: "value",
                type: "number"
            }
        ]
    },
    {
        name: "income",
        label: "Einkommen",
        fields: [
            {
                label: "Betrag",
                name: "value",
                type: "number"
            }
        ]
    }
]