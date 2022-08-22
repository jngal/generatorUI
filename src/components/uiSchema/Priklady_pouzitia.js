export const DEFAULT_DATA_SCHEME = `
{
    "NAZOV": "Názov",
    "C_ZDROJ": "Vodný zdroj",
    "CAS": "2021-09-14T16:15:17.043Z",
    "DATUM": "2021-09-12T22:00:00.000Z",
    "MERANIE_1": 10,
    "MERANIE_2": 15,
    "MERANIE_3": 18,
    "POZN": "Text pre poznámku",
    "Zrus": false,
    "ID": 19,    
}
`;



export const DEFAULT_UI_SCHEMA = `
[
    [
        [
            [{ "field": "NAZOV" }, { "field": "DATUM" }],
            [{ "field": "C_ZDROJ" }, { "field": "CAS" }]
        ],
        [
            [{ "field": "MERANIE_1" }],
            [{ "field": "MERANIE_2" }],
            [{ "field": "MERANIE_3" }]
        ],
        [
            [{ "field": "POZN" }]
        ],
        [
            [{ "field": "ZRUS" }],
            [{ "field": "ID" }]
        ]
    ]
]`;



[
    [
        [
            [{ prvok1 }, { prvok2 }],
            [{ prvok3 }, { prvok4 }]
        ],
        [
            [{ prvok5 }, { prvok6 }],
            [{ prvok7 }, { prvok8 }],
            [{ prvok9 }, { prvok10 }]
        ]
    ]
]




