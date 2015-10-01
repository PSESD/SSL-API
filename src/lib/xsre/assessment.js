/**
 * Created by zaenal on 01/10/15.
 */
var moment = require('moment');
var _ = require('underscore');
var l = require('lodash');
/**
 *
 * @param xsre
 * @constructor
 */
function Assessment(xsre){

      this.assessments = null;

      this.collections = [];

      if(xsre.json) {

            if(xsre.json.assessments) this.assessments = xsre.json.assessments;

      }

      this.config = xsre.config;

      this.notAvailable = 'N/A';

      this.facets = xsre.facets;

}
/**
 *
 * @returns {object}
 */
Assessment.prototype.getAssessment = function(){

      var me = this;

      if(null !== me.assessments) {

            me.processAssessment(me.assessments);

      }

      return me.collections;
};
/**
 *
 * @param assessment
 */
Assessment.prototype.processAssessment = function(assessment){

      var me = this;


      if(me.assessments.assessment){

            me.assessments.assessment.forEach(function(assessment){

                  var collectionScoreSets = {
                        schoolYear: null,
                        testSeason: null,
                        testSchoolId: null,
                        testSchoolName: null,
                        testGrade: null,
                        maps: [],
                        states: []
                  };

                  var collectionState = {
                        Title: null,
                        SubjectArea: null,
                        TestName: null,
                        TestAttemptCode: null,
                        TestAttempt: null,
                        Score: null,
                        LevelCode: null,
                        MetStandard: null
                  };

                  var collectionMap = {
                        Title: null,
                        SubjectArea: null,
                        TestName: null,
                        RITScore: null,
                        PercentileRank: null,
                        MetTypicalGrowth_LastFall2ThisFall: null,
                        MetTypicalGrowth_LastSpring2ThisSpring: null,
                        MetTypicalGrowth_LastFall2ThisSpring: null
                  };

                  if(l.has(assessment, 'scoreSets.scoreSet')){

                        if(!_.isArray(assessment.scoreSets.scoreSet)){

                              assessment.scoreSets.scoreSet = [ assessment.scoreSets.scoreSet ];

                        }

                        assessment.scoreSets.scoreSet.forEach(function(scoreSet){

                              var attemptCode = l.get(scoreSet, 'attemptCode');

                              var newCollection = null;
                              /**
                               * Check if its MAP or STATE
                               */
                              if(attemptCode){
                                    /**
                                     * STATE HERE
                                     */
                                    newCollection = l.assign(collectionState, {
                                          SubjectArea: l.get(scoreSet, 'subTestSubjectArea'),
                                          TestName: l.get(scoreSet, 'subTestName'),
                                          TestAttemptCode: attemptCode,
                                          TestAttempt: l.has(me.config.xAssessmentAttemptCodeType, attemptCode) ?
                                                me.config.xAssessmentAttemptCodeType[attemptCode].description : null
                                    });

                                    if(l.has(scoreSet, 'scores.score')){

                                          scoreSet.scores.score.forEach(function(score){

                                                switch (score.metric){
                                                      case '03479':
                                                            newCollection.Score = score.scoreValue;
                                                            break;
                                                      case '00503':
                                                            newCollection.LevelCode = score.scoreValue;
                                                            break;
                                                      case '00500':
                                                            newCollection.MetStandard = score.scoreValue;
                                                            break;
                                                }

                                          });

                                    }

                                    collectionScoreSets.states.push(newCollection);

                              } else {
                                    /**
                                     * Map Here
                                     */
                                    newCollection = l.assign(collectionMap, {
                                          SubjectArea: l.get(scoreSet, 'subTestSubjectArea'),
                                          TestName: l.get(scoreSet, 'subTestName')
                                    });

                                    if(l.has(scoreSet, 'scores.score')){

                                          scoreSet.scores.score.forEach(function(score){

                                                switch (score.metric){
                                                      case '00506':
                                                            newCollection.RITScore = score.scoreValue;
                                                            break;
                                                      case '00502':
                                                            newCollection.PercentileRank = score.scoreValue;
                                                            break;
                                                      case '03474':

                                                            var scoreValues = String(score.scoreValue).trim().split(' ');

                                                            if(scoreValues.length === 2 && l.has(newCollection, scoreValues[0]) && !_.isEmpty(scoreValues[1])){

                                                                  newCollection[scoreValues[0]] = scoreValues[1].toLowerCase() === 'true' ? 'Yes' : 'No';

                                                            }

                                                            break;
                                                }

                                          });

                                    }

                                    collectionScoreSets.maps.push(newCollection);

                              }

                        });

                  }

                  collectionScoreSets.schoolYear = null;
                  collectionScoreSets.testSchoolId = l.get(assessment, 'school.localId', me.notAvailable);
                  collectionScoreSets.testSchoolName = l.get(assessment, 'school.schoolName', me.notAvailable);
                  collectionScoreSets.testGrade = l.get(assessment, 'studentGradeLevel', me.notAvailable);

                  me.collections.push(collectionScoreSets);

            });

      }


};
/**
 *
 * @param code
 */
Assessment.prototype.getMetricMap = function(code){

      var metricMap = this.config.xSubtestScoreMetricType;

      code = parseInt(code);

      code = String(code);

      return l.get(metricMap, code, null);

};



module.exports = Assessment;