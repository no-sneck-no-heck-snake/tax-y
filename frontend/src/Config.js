

export const BASE_URI = "http://10.10.1.123:5000"

export const DOCUMENT_TYPES = [
    {
        name: "interest_statement",
        label: "Vermögensausweis",
        fields: [
            {
							label: "Betrag",
							name: "amount",
							type: "number"
						},
						{
							label: "Jahr",
							name: "year",
							type: "number"
						},
						{
							label: "Zinsen",
							name: "interest",
							type: "number"
						}
        ],
    },
    {
        name: "wage_card",
        label: "Lohnausweis",
        fields: [
            {
                label: "Betrag",
                name: "amount",
                type: "number"
            }
        ]
    },
    {
        name: "bill",
        label: "Rechnung",
        fields: [
            {
                label: "Betrag",
                name: "amount",
                type: "number"
            }
        ]
    }
]