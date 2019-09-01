import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import * as d3 from "d3";
import faker from "faker";
import styled from "styled-components";

function generateData(level) {
  const Num = d3.randomUniform(1, 10)(); //randomUniform is a function of D3
  return d3.range(Num).map(i => ({
    value: Math.abs(d3.randomNormal()()),
    id: `${level}-${i}`,
    level: level,
    index: i,
    name: faker.company.companyName(),
    children: level > 0 ? generateData(level - 1) : []
  }));
}
const Path = styled.path`
  fill: ${props => d3.schemePastel2[props.index]};
  cursor: pointer;
`;

const Arc = ({ arcData }) => {
  const [addedRadius, setAddedRadius] = useState(0);
  const arc = d3
    .arc()
    .innerRadius(25 + addedRadius / 3)
    .outerRadius(125 + addedRadius);

  function mouseOver() {
    setAddedRadius(20);
  }

  function mouseOut() {
    setAddedRadius(0);
  }
  return (
    <Path
      d={arc(arcData)}
      index={arcData.data.index}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
    />
  );
};
const DrilldownPie = ({ data, x, y }) => {
  const pie = d3.pie().value(d => d.value);
  // console.log(pie(data));

  return (
    <g transform={`translate(${x},${y})`}>
      {pie(data).map(d => (
        <Arc arcData={d} key={d.id} />
      ))}
    </g>
  );
};

function App() {
  const data = generateData(4);
  console.log(data);
  return (
    <div className="App">
      <h1>Dataviz with drilldown by React & D3</h1>
      <svg width="500" height="500">
        <DrilldownPie data={data} x={250} y={250} />
      </svg>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
