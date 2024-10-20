import React, {useEffect, useRef, useState} from "react";
import {Customer} from "../../../typing";
import * as echarts from "echarts";
import {getWeekOf, isDateInSelectedWeek, sortWorkoutsAsc} from "../../../utils/utilities.ts";

const CalorieWidget = ({customer, weekDate}: { customer: Customer, weekDate: string }) => {
    const chartInstance = useRef<any>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const [caloricData, setCaloricData] = useState<number[]>([]);
    const [weekOf, setWeekOf] = useState<string[]>([]);
    const hasAddedHeader = useRef(false);


    useEffect(() => {
        setCaloricData([]);
        const newCaloricData: number[] = [];
        if (customer?.workouts) {
            const workouts = sortWorkoutsAsc(customer.workouts);
            for (let i = 0; i < workouts.length; i++) {
                const date = new Date(workouts[i].workoutDate.toString());
                if (isDateInSelectedWeek(date, new Date(weekDate))) {
                    newCaloricData[date.getDay()] = (workouts[i].calories!);
                }
            }

            // Gets the current week to display in chart
            const date = new Date(weekDate);
            const week: string[] = [];
            getWeekOf(date, week);
            setWeekOf(week);
        }
        setCaloricData(newCaloricData);
    }, [customer, weekDate]);  // Only run when customer or weekDate changes

    useEffect(() => {
        if (caloricData.length === 0 && !hasAddedHeader.current) {
            const noDataDom = document.getElementById("calorie-graph");
            const noDataText = document.createElement("h2");
            noDataText.textContent = "No Caloric Data Available";
            if (noDataDom) {
                noDataDom.appendChild(noDataText);
                hasAddedHeader.current = true;
            }
        }
    }, [weekOf]);

    useEffect(() => {
        if (caloricData.length !== 0 && chartRef.current) {
            if (!chartInstance.current) {
                chartInstance.current = echarts.init(chartRef.current);
                hasAddedHeader.current = false;
            }

            chartInstance.current.setOption({
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
                        symbolSize: 7,
                        data: caloricData.map(val => val !== null ? val : undefined),
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
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }

        };
    }, [caloricData]);  // Only reinitialize if caloricData

    return (
        <div>
            <div>
                <div ref={chartRef} id="calorie-graph" className="visual-widget" 
                    style={{width: "475px", height: "300px"}}/>
            </div>
        </div>
    );
};

export default CalorieWidget;