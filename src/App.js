import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, preetyPrintStat } from "./util";
// import LineGraph from './LineGraph'

function App() {
  const [country, setCountry] = useState([]);
  const [countryvalue, setCountryvalue] = useState(["worldwide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    //will call a async request
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setCountry(countries);
          setMapCountries(data);
          setTableData(sortedData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountryvalue(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryvalue(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  return (
    <div className="app">
      <div className="app_left">
        <div className="app__header">
          <a className="app_link" href="/">
            <h1>Covid-19 Tracker</h1>
          </a>

          <FormControl className="app__dropdown">
            <p>Select the country here:</p>
            <Select
              variant="outlined"
              value={countryvalue}
              onChange={onCountryChange}
            >
              {country.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {countryvalue.includes("worldwide") ? (
          <div className="app__worldwide">Worldwide data</div>
        ) : null}
        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={preetyPrintStat(countryInfo.todayCases)}
            total={preetyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered cases"
            cases={preetyPrintStat(countryInfo.todayRecovered)}
            total={preetyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Death cases"
            cases={preetyPrintStat(countryInfo.todayDeaths)}
            total={preetyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app-right">
        <CardContent>
          <h3>Live cases by country (Total)</h3>
          <Table countries={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
