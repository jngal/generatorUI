import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IntlProvider, load, LocalizationProvider, loadMessages } from '@progress/kendo-react-intl';
import Help from './Help';

import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import currencyData from 'cldr-data/supplemental/currencyData.json';
import weekData from 'cldr-data/supplemental/weekData.json';

import numbers from 'cldr-data/main/sk/numbers.json';
import currencies from 'cldr-data/main/sk/currencies.json';
import caGregorian from 'cldr-data/main/sk/ca-gregorian.json';
import dateFields from 'cldr-data/main/sk/dateFields.json';
import timeZoneNames from 'cldr-data/main/sk/timeZoneNames.json';
import Textarea from '../../coraWebComponents/forms/Textarea';

import sk from '../../coraWebComponents/res/sk.json';
import './index.scss';

load(likelySubtags, currencyData, weekData, numbers, currencies, caGregorian, dateFields, timeZoneNames);
loadMessages(sk, 'sk-SK');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheme: DEFAULT_SCHEME,
      uiScheme: DEFAULT_UI_SCHEME,
      parsedScheme: JSON.parse(DEFAULT_SCHEME),
      parsedUiScheme: JSON.parse(DEFAULT_UI_SCHEME),
    };
  }

  handleChange = (field, value) => {
    console.log(field, value);
    if (field === "scheme") {
      this.setState({
        parsedScheme: JSON.parse(value)
      });
    }
    else if (field === "uiScheme") {
      this.setState({
        parsedUiScheme: JSON.parse(value)
      });
    } else {
      this.setState({
        ...this.state,
        [field]: value
      });
    }
  }

  getValue = (field) => {
    return '';
  }

  render() {

    console.log(this.state.parsedScheme, this.state.parsedUiScheme);
    return (
      <LocalizationProvider language="sk-SK">
        <IntlProvider locale="sk">
          
                create fieldu
                <Textarea
                  name="Title"
                  onChange={this.handleChange}
                  value={this.state.title}
                  required={true}
                  title="Názov inputu"
                />
                <DropDownList
                  name="Typ"
                  data={this.props.listTypSubjektu.data}
                  textField="TypInputu"
                  onChange={this.handleChange}
                  value={this.state.TypSubjektu}
                  required={true}
                />
                <Switch
                  name="Zrus"
                  onChange={this.handleChange}
                  value={this.state.Zrus}
                  disabled={false}
                />
              
        </IntlProvider>
      </LocalizationProvider>
    );
  }
}

export default App;
