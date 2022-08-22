import React from 'react';
// import logo from '../../logo.svg';
import './Basic.scss';
import { IntlProvider, load, LocalizationProvider, loadMessages } from '@progress/kendo-react-intl';
// import Help from '../help/Help';

import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import currencyData from 'cldr-data/supplemental/currencyData.json';
import weekData from 'cldr-data/supplemental/weekData.json';

import numbers from 'cldr-data/main/sk/numbers.json';
import currencies from 'cldr-data/main/sk/currencies.json';
import caGregorian from 'cldr-data/main/sk/ca-gregorian.json';
import dateFields from 'cldr-data/main/sk/dateFields.json';
import timeZoneNames from 'cldr-data/main/sk/timeZoneNames.json';
import Textarea from '../../coraWebComponents/forms/Textarea';
// import DropDownList from '../../coraWebComponents/forms/DropDownList';
// import Switch from '../../coraWebComponents/forms/Switch';

import sk from '../../coraWebComponents/res/sk.json';
import Detail from '../../coraWebComponents/detail/Detail';
import '../../index.scss';
import 'jsoneditor-react/es/editor.min.css';

load(likelySubtags, currencyData, weekData, numbers, currencies, caGregorian, dateFields, timeZoneNames);
loadMessages(sk, 'sk-SK');

const DEFAULT_SCHEME = `
[
  {
    "field": "NAZOV",
    "title": "Názov",
    "type": "string",
    "required": true,
    "disabled": false
  },
  {
    "field": "ID",
    "title": "ID",
    "type": "number",
    "required": true,
    "disabled": false
  },
  {
    "field": "C_ZDROJ",
    "title": "Vodný zdroj",
    "type": "number",
    "required": true,
    "disabled": false
  },
  {
    "field": "MERANIE_1",
    "title": "Meranie 1",
    "type": "numeric",
    "required": true,
    "disabled": false
  },
  {
    "field": "MERANIE_2",
    "title": "Meranie 2",
    "type": "numeric",
    "required": true,
    "disabled": false
  },
  {
    "field": "MERANIE_3",
    "title": "Meranie 3",
    "type": "numeric",
    "required": true,
    "disabled": false
  },
  {
    "field": "ZRUS",
    "title": "Zrušené",
    "type": "boolean",
    "required": false,
    "disabled": false
  },
  {
    "field": "DATUM",
    "title": "Dátum",
    "type": "date",
    "required": true,
    "disabled": false
  },
  {
    "field": "CAS",
    "title": "Čas",
    "type": "time",
    "required": true,
    "disabled": false
  },
  {
    "field": "POZN",
    "title": "Poznámka",
    "type": "text",
    "required": false,
    "disabled": false
  },
  {
    "field": "Prilohy",
    "title": "Prílohy",
    "type": "files",
    "disabled": false,
    "url": "/api/file-dis",
    "data": {
      "I_ZAZ": 1454916,
      "POZN": "poznamka",
      "KEYWORDS": "priloha"
    }
  }
]
`;

const DEFAULT_UI_SCHEME = `
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
]
`;

const DEFAULT_DATA_SCHEME = `
{
  "ID": 19,
  "Poradie": 2,
  "Zrus": false,
  "Poznamka": "Skuska",
}
`;

// "Cas": "2021-09-14T16:15:17.043Z",
// "Datum": "2021-09-12T22:00:00.000Z"

class Basic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme: DEFAULT_SCHEME,
      uiScheme: DEFAULT_UI_SCHEME,
      // formData: DEFAULT_DATA_SCHEME,
      parsedScheme: this.tryToParse(DEFAULT_SCHEME, {}),
      parsedUiScheme: this.tryToParse(DEFAULT_UI_SCHEME, {}),
      parsedFormData: this.tryToParse(DEFAULT_DATA_SCHEME, {}),
      title: "Zadaj názov fieldu",
      typField: {
        fields: [
          { type: "TextField" },
          { type: "Number" },
          { type: "DatePicker" },
          { type: "Picker" },
        ]
      },
      selectedTypeField: "",
      required: false,
    };
  }

  tryToParse = (text, orignal) => {
    const iterate = (obj) => {
      for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] === "object") {
            iterate(obj[property]);
          } else {
            const foundField = this.state?.parsedScheme?.find(x => x.field === property);
            if (foundField) {
              if (foundField.type === 'date' && !(obj[property] instanceof Date)) {
                var parsedDate = Date.parse(obj[property]);
                if (isNaN(obj[property]) && !isNaN(parsedDate)) {
                  obj[property] = new Date(obj[property]);
                } else {
                  obj[property] = new Date();
                }
              }
            }
          }
        }
      }
    }

    try {
      let parsedJson = JSON.parse(text);
      iterate(parsedJson);
      console.log('parsed', parsedJson);
      return parsedJson;
    }
    catch (ex) {
      return orignal;
    }
  }
  handleChange = (field, value) => {
    if (field === "scheme") {
      this.setState({
        parsedScheme: this.tryToParse(value, this.state.parsedScheme)
      });
    }
    else if (field === "uiScheme") {
      this.setState({
        parsedUiScheme: this.tryToParse(value, this.state.parsedUiScheme)
      });

    } else if (field === "formData") {
      this.setState({
        parsedFormData: JSON.parse(value) //this.tryToParse(value, this.state.parsedFormData)
      });
    } else {
      this.setState({
        ...this.state,
        parsedFormData: value
      });
    }
  }

  getValue = (field) => {
    return this.state.parsedFormData[field];
  }
  onChange = (name, value) => {
    this.setState((state) => {
      return {
        ...state,
        parsedFormData: {
          ...state.parsedFormData,
          [name]: value
        }
      }
    })
  }
  // , () => {
  //   //console.log(JSON.stringify(this.state.parsedFormData));
  //   this.setState({          
  //       formData: JSON.stringify(this.state.parsedFormData, null, '\t'),
  //       // parsedFormData: this.state.parsedFormData,


  //  }
  //  );
  //       console.log("Prekreslujem v prazdnom")

  // })
  //   }

  render() {

    console.log(this.state.parsedScheme, this.state.parsedUiScheme);
    return (
      <LocalizationProvider language="sk-SK">
        <IntlProvider locale="sk">
          <div className="body">
            <div className="default-scheme">
              <div className="scheme">
                <Textarea
                  name="scheme"
                  onChange={this.handleChange}
                  value={this.state.scheme}
                  defaultExpanded={true}
                  required={true}
                  maxLength={5000}
                  title="schema"
                />
              </div>
              <div className="ui-scheme">
                <Textarea
                  name="uiScheme"
                  onChange={this.handleChange}
                  value={this.state.uiScheme}
                  defaultExpanded={true}
                  required={true}
                  maxLength={5000}
                  title="UI Schema"
                />
              </div>
              <div className="form-data">
                <Textarea
                  name="formData"
                  onChange={this.handleChange}
                  value={JSON.stringify(this.state.parsedFormData)}
                  defaultExpanded={true}
                  required={true}
                  maxLength={5000}
                  title="FormData"
                />
                {/* {console.log("parsed", this.state.parsedFormData)}
                <Editor
                  mode={"form"}
                  value={this.state.parsedFormData}
                  onChange={(e) => this.handleChange('formData', e)}
                /> */}
              </div>
            </div>
            <div className="create-field">
              {/* <div>
                <span>Create new field</span>
                <Textarea
                  name="Title"
                  onChange={this.handleChange}
                  value={this.state.title}
                  required={true}
                  title="Názov inputu"
                />
                <DropDownList
                  name="Typ"
                  data={this.state.typField.fields}
                  textField="TypInputu"
                  onChange={this.handleChange}
                  value={this.state.typField.fields.type}
                />
                <Switch
                  name="Zrus"
                  onChange={this.handleChange}
                  value={this.state.required}
                  disabled={false}
                />
              </div> */}
              {
                this.state.parsedScheme &&
                this.state.parsedUiScheme &&
                this.state.parsedFormData &&
                <Detail
                  schema={this.state.parsedScheme}
                  ui={this.state.parsedUiScheme}
                  data={this.state.parsedFormData}
                  getValue={this.getValue}
                  onChange={this.onChange}
                  handleBlur={() => console.log('not implemented')}
                  hiddenBack={true}
                  hiddenSave={true}
                  disabledNext={true}
                  disabledPrevious={true}
                  previous={false}
                  next={false}
                  toolbar={false}
                  primaryField="ID"
                />
              }
            </div>
          </div>

          {/* <Help
            listPracZaradenie={{ data: [], total: 0 }}
            listTypSubjektu={{ data: [], total: 0 }}
            getListPracZaradenie={(filter, sort, page) => console.log('FETCH')} /> */}

        </IntlProvider>
      </LocalizationProvider>
    );
  }
}

export default Basic;
