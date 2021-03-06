import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFoodDiary, leaveTab } from '../../../actions/foodDiary';
import FoodDiaryLog from './FoodDiaryLog';
import FoodDiaryEntry from './FoodDiaryEntry';
import RadarGraph from '../../ToolBox/RadarGraph';
import Cookies from 'js-cookie'


class FoodDiary extends Component {

  constructor(props) {
    super(props);
    this.state = {
      diaryData: null
    }
  }

  componentWillMount() {
    this.props.fetchFoodDiary();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      diaryData: nextProps.diaryData
    });
  }

  componentDidUpdate() {
    this.render();
  }

  componentWillUnmount() {
    this.props.leaveTab();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.diaryData !== nextProps.diaryData;
  }

  render() {

    const foodDiaryEntry = Cookies.get('userID') === Cookies.get('currentProfileID') ? <FoodDiaryEntry /> : null;
    const deleteEntry = Cookies.get('userID') === Cookies.get('currentProfileID') ? <th className="fdth">Delete</th> : null;

    if(this.state.diaryData !== null) {

      const diaryDataByDate = this.state.diaryData.map((set, idx) => {
        const logsPerDay = set.logs.map((log, idx) => <FoodDiaryLog key={idx} log={log} />);
        const date = set.date
        return (
          <li className="foodDiaryLogList" key={idx}>
            <h3 className='date'>{date}</h3>
            <table className='table foodDiaryLogTable'>
              <tbody>
                <tr>
                  <th className="fdth">Qty</th>
                  <th className="fdth">Food Name</th>
                  <th className="fdth">Calories (kcal)</th>
                  <th className="fdth">Carbohydrates (g)</th>
                  <th className="fdth">Protein (g)</th>
                  <th className="fdth">Fat (g)</th>
                  <th className="fdth">Fiber (g)</th>
                  <th className="fdth">n6 (g)</th>
                  {deleteEntry}
                </tr>
                {logsPerDay}
              </tbody>
            </table>
            <div className="radarGraphDiv">
              <table className="radarGraphTable"><tr>
                <th><RadarGraph className="radarGraphAmount" type={'amount'} size={'small'} date={date} /></th>
                <th><RadarGraph className="radarGraphPercentage" type={'ratio'} size={'small'} date={date} /></th>
              </tr>
              </table>
            </div>
          </li>
        );
      });

      return (
        <div>
          <h1 className="foodDiaryHeader">Food Diary</h1>
          {foodDiaryEntry}
          <ul>
            {diaryDataByDate}
          </ul>
        </div>
      );

    } else {

      return (
        <div>
          <h3>Loading food diary...</h3>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    diaryData: state.foodDiary.logs,
    actualMacros: state.userProfile.actualMacros,
  }
}

export default connect(mapStateToProps, { fetchFoodDiary, leaveTab })(FoodDiary);
