import React from 'react';
// import React, {Component} from 'react';
// import { ReactDOM } from 'react';
import './App.css';
import Basic from './components/uiSchema/Basic';
import './index.scss';

import Tabs from "./components/Tab/Tab";
import Panel from "./components/Tab/Panel";
// import DragDrop from './components/DragDrop/DragDrop';
import GeneratorOutput from './components/GeneratorOutput/GeneratorOutput';
// import DnD from './components/DnD/DnD';
import Generator from './components/Generator/Generator';
// import DragDrop from './components/DragDrop/DragDrop';

// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        output: null
    };
  }

  setGeneratedUiScheme = (output) => {
    this.setState({output});
  }
  
  render() {
    return (
      <div className="main-container">
        <div style={{ marginLeft: "33px" }}>
          <h1>Diplomová práca</h1>
          {/* <h3>Bc. Ján Galovič</h3> */}
        </div>
        <hr />
        <br />
        <Tabs>
          {/* <Panel title="Dragdrop">
            <DragDrop />
          </Panel> */}

          
          <Panel title="Basic" key='1'>
            <Basic />
          </Panel>
          <Panel title="JSON výstup" key='2'>
            <GeneratorOutput output={this.state.output}/>
          </Panel>
          <Panel title="Generator" id='4' key='3'>
            <Generator setGeneratedUiScheme={this.setGeneratedUiScheme}/>
          </Panel>
          
        </Tabs>
      </div>
    );
  }
}

export default App;
