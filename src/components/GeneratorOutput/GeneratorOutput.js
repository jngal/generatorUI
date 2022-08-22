import React from "react";
import Textarea from '../../coraWebComponents/forms/Textarea';

const GeneratorOutput = ({ output }) => {
  if(!output) return null;
  const { generatedUiScheme, generatedUiSchemeMinified } = output;

  return (
    <div className="JSONconvertor" style={{ display: "flex" }}>
      <div style={{ flex: "1"}}>
        <Textarea
          name="uiScheme"
          onChange={() => {}}
          value={generatedUiScheme}
          defaultExpanded={true}
          maxLength={50000}
          title="UI Schema"
        />
      </div>
      <div style={{ flex: "1"}}>
      <Textarea
          name="uiScheme"
          onChange={() => {}}
          value={generatedUiSchemeMinified}
          defaultExpanded={true}
          maxLength={5000}
          title="UI Schema Minified"
        />
      </div>
    </div>
  );
};

export default GeneratorOutput;