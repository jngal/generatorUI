import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Detail from '../../coraWebComponents/detail/Detail';
// import Input from '../../coraWebComponents/forms/Input';
// import Switch from '../../coraWebComponents/forms/Switch';
// import NumericTextBox from '../../coraWebComponents/forms/NumericTextBox';
// import Picker from '../../coraWebComponents/forms/Picker';
// import DatePicker from '../../coraWebComponents/forms/DatePicker';
// import DropDownList from '../../coraWebComponents/forms/DropDownList';
// import Textarea from '../../coraWebComponents/forms/Textarea';
// import Upload from '../../coraWebComponents/forms/Upload';
// import MultiSelect from '../../coraWebComponents/forms/MultiSelect';
import _ from 'lodash';

// const GRID_SCHEMA = [
//   { field: "PracZaradenieID", title: "ID", filter: "numeric" },
//   { field: "PracZaradenieNazov", title: "Názov" },
//   { field: "Zrus", title: "Zrušené", filter: "boolean" }
// ];

// const vlastnyObsah = (
//   <React.Fragment>
//     <b style={{
//       textAlign: "center",
//       fontSize: 22,
//       display: "block",
//       fontWeight: 900,
//       marginTop: 60
//     }}>
//       Vlastný obsah
//     </b>
//     <b style={{
//       textAlign: "center",
//       fontSize: 16,
//       display: "block",
//       fontStyle: "italic",
//       fontWeight: 200,
//       marginBottom: 20
//     }}>
//       Lorem ipsum sit dolor
//     </b>
//   </React.Fragment>
// )

const UI = [
  [
    [
      [
        { field: "ID" },
        { field: "Poradie" },
        { field: "Zrus" },
        { field: "Datum" },
        { field: "Cas" },
        { field: "TypSubjektu" },
        { field: "Poznamka" },
        { field: "Prilohy" }
      ]
    ]
  ]
];

const SCHEMA = [
  { field: "ID", title: "ID", type: "string", required: true, disabled: false },
  { field: "Poradie", title: "Poradie", type: "numeric", required: true, disabled: false },
  { field: "Zrus", title: "Zrušené", type: "boolean", required: false, disabled: false },
  { field: "Datum", title: "Dátum", type: "date", required: true, disabled: false },
  { field: "Cas", title: "Čas", type: "time", required: true, disabled: false },
  { field: "TypSubjektu", title: "Typ subjektu", type: "enum", required: true, disabled: false, dataField: 'listTypSubjektu', textField: 'TypSubjektuNazov' },
  { field: "Poznamka", title: "Poznámka", type: "text", required: false, disabled: false },
  {
    field: "Prilohy",
    title: "Prílohy",
    type: "files",
    disabled: false,
    url: "/api/file-dis",
    data: { I_ZAZ: 1454916, POZN: 'poznamka', KEYWORDS: 'priloha' }
  }
];

class Demos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ID: 1,
      PracZaradenie: null,
      Poradie: 0,
      Zrus: false,
      Datum: null,
      Cas: null,
      TypSubjektu: null,
      Poznamka: "Poznamka",
      Prilohy: [],
      currentTimeFrom: null,
      MultiTyp: []
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  handleSubmit = () => {
    console.log('submit');
  }
  getValue = field => {
    return _.get(this.state.data, field.split('.'));
  }

  render() {
    return (
      <div>
        <Detail
          getValue={this.getValue}
          onSubmit={this.handleSubmit}
          schema={SCHEMA}
          data={this.state}
          onChange={this.handleChange}
          parentProps={this.props}
          isLoading={false}
          ui={UI}
          primaryField="ID"
          onUpload={res => console.log(res)}
          toolbarHidden
        />
        {/* <Detail
          onSubmit={this.handleSubmit}
          isLoading={false}
          primaryField="ID"
          getValue={this.getValue}
        >
          <div className="row">
            <div className="col-md">
              <div className="k-form-field">
                <span>ID</span>
                <Input
                  name="ID"
                  required={true}
                  onChange={this.handleChange}
                  value={this.state.ID}
                  disabled={false}
                />
              </div>
              <div className="k-form-field">
                <span>Pracovné zaradenie</span>
                <Picker
                  textField="PracZaradenieNazov"
                  onChange={this.props.getListPracZaradenie}
                  data={this.props.listPracZaradenie.data}
                  isLoading={this.props.listPracZaradenie.isLoading}
                  onSelect={this.handleChange}
                  selected={this.state.PracZaradenie}
                  schema={GRID_SCHEMA}
                  total={this.props.listPracZaradenie.total}
                  required={true}
                  disabled={false}
                  name="PracZaradenie"
                  primaryField="PracZaradenieID"
                  title="Pracovné zaradenie"
                  initFilter={{ filters: [{ field: "Zrus", operator: "eq", value: false }] }}
                />
              </div>
              <div className="k-form-field">
                <span>Poradie</span>
                <NumericTextBox
                  name="Poradie"
                  onChange={this.handleChange}
                  value={this.state.Poradie}
                  required={true}
                  disabled={false}
                />
              </div>
              <div className="k-form-field">
                <span>Zrušené</span>
                <Switch
                  name="Zrus"
                  onChange={this.handleChange}
                  value={this.state.Zrus}
                  disabled={false}
                />
              </div>
              <div className="k-form-field">
                <span>Dátum</span>
                <DatePicker
                  name="Datum"
                  onChange={this.handleChange}
                  value={this.state.Datum}
                  disabled={false}
                  required={true}
                />
              </div>
              <div className="k-form-field">
                <span>Typ</span>
                <DropDownList
                  name="TypSubjektu"
                  data={this.props.listTypSubjektu.data}
                  textField="TypSubjektuNazov"
                  onChange={this.handleChange}
                  value={this.state.TypSubjektu}
                  required={true}
                />
              </div>
              <div className="k-form-field">
                <span>Poznámka</span>
                <Textarea
                  name="Poznamka"
                  onChange={this.handleChange}
                  value={this.state.Poznamka}
                  required={true}
                  title="Poznámka"
                />
              </div>
              <div className="k-form-field">
                <span>Prílohy</span>
                <Upload
                  name="Prilohy"
                  onChange={this.handleChange}
                  value={this.state.Prilohy}
                  url="/api/file-dis"
                  data={{ I_ZAZ: 1454916, POZN: 'poznamka', KEYWORDS: 'priloha' }}
                  onUpload={res => console.log(res)}
                />
              </div>
              <div className="k-form-field">
                <span>Multi typ</span>
                <MultiSelect
                  name="MultiTyp"
                  data={this.props.listTypSubjektu.data}
                  textField="TypSubjektuNazov"
                  onChange={this.handleChange}
                  value={this.state.MultiTyp}
                  required={true}
                />
              </div>
            </div>
          </div>
        </Detail> */}
      </div>
    );
  }
}

Demos.propTypes = {
  listPracZaradenie: PropTypes.object.isRequired,
  listTypSubjektu: PropTypes.object.isRequired,
  getListPracZaradenie: PropTypes.func.isRequired
}

export default Demos;