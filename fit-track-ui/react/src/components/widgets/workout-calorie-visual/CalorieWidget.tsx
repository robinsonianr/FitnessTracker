import React, {useEffect} from "react";
import {Customer} from "../../../typing";
import * as echarts from "echarts";
import {isDateInThisWeek, sortWorkouts} from "../../../utils/utilities.ts";

const CalorieWidget = ({customer}: { customer: Customer }) => {
    const caloricData: number[] = [];
    const weekOf: string[] = [];

    if (customer?.workouts) {
        const workouts = sortWorkouts(customer.workouts);
        for (let i = 0; i < workouts.length; i++) {
            const date = new Date(workouts[i].workoutDate.toString());
            if (isDateInThisWeek(date)) {
                caloricData[date.getDay()] = (workouts[i].calories!);
            } else {
                break;
            }
        }
        // Gets the current week to display in chart
        const date = new Date();
        isDateInThisWeek(date, weekOf);
    }

    useEffect(() => {
        if (caloricData.length !== 0) {
            const caloricChart = echarts.init(document.getElementById("calorie-graph"));

            caloricChart.setOption({
                color: "whites",
                title: {
                    text: "Caloric Expenditure",
                    left: "center",
                    textStyle: {
                        color: "white",
                    }
                },
                tooltip: {},
                xAxis: {
                    name: "Week of (" + weekOf[0] + " - " + weekOf[1] + ")",
                    nameLocation: "middle",
                    nameTextStyle: {
                        color: "white"
                    },
                    nameGap: 40, // Distance between the title and the axis
                    axisLabel: {
                        color: "white"
                    },
                    boundaryGap: false,
                    data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

                },
                yAxis: {
                    name: "Calories (kcal)",
                    nameTextStyle: {
                        color: "white"
                    },

                    axisLabel: {

                        color: "white"
                    }
                },
                series: [
                    {
                        type: "line",
                        color: "#3f76c0",
                        data: caloricData,
                        connectNulls: true,
                        areaStyle: {},
                        markArea: {
                            itemStyle: {
                                color: "rgba(163, 163, 163, 0.4)"
                            },
                            data: [
                                [
                                    {
                                        xAxis: "Sun"
                                    },
                                    {
                                        xAxis: "Mon"
                                    }
                                ],
                                [
                                    {
                                        xAxis: "Fri"
                                    },
                                    {
                                        xAxis: "Sat"
                                    }
                                ]
                            ]
                        }
                    }
                ]
            });

            return () => {
                caloricChart.dispose();
            };
        }

    }, [customer]);


    return (
        <div>
            {caloricData.length === 0 ? (
                <div className="visual-widget" style={{width: "475px", height: "300px"}}>
                    <h2>No Caloric Data Available</h2>
                </div> // Display a message if no data
            ) : (
                <div id="calorie-graph" className="visual-widget" style={{width: "475px", height: "300px"}}/>
            )}
        </div>
    );
};

export default CalorieWidget;