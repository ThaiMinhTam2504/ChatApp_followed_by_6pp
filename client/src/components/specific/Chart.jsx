import React from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
    CategoryScale,
    Chart as ChartJS,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend,
    scales,
    plugins
} from 'chart.js'
import { orange, orangeLight, purple, purpleLight } from '../constants/color'
import { getLast7Days } from '../../lib/features'


ChartJS.register(
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend

)

const labels = getLast7Days()


const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        }
    },
    scales: {
        x: {

            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: true
            },

        }
    }
}

const LineChart = ({ value = [] }) => {

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Users',
                data: value,
                backgroundColor: purpleLight,
                borderColor: purple,
                fill: true
            },
        ],
    }
    return <Line
        data={data}
        options={lineChartOptions} />


}


const doughnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false
        }
    },
    cutout: 120
}

const DoughnutChart = ({ value = [], labels = [] }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                data: value,
                label: 'Total Chats vs Group Chats',
                backgroundColor: [purpleLight, orangeLight],
                borderColor: [purple, orange],
                hoverBackgroundColor: [purple, orange],
                offset: 20,
            }
        ]
    }
    return <Doughnut
        style={{ zIndex: 10 }}
        data={data}
        options={doughnutChartOptions} />
}

export { LineChart, DoughnutChart }