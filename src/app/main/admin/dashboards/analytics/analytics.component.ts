import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { AnalyticsDashboardDb } from 'app/fake-db/dashboard-analytics';
import { AnalyticsDashboardService } from './analytics.service';
import * as shape from 'd3-shape';
import { ProjectDashboardDb } from 'app/fake-db/dashboard-project';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
    widgets: any;
    widget1SelectedYear = '2019';
    widget5SelectedDay = 'today';
    statisticWidget: any[] = [];
    public getUserApiUrl = environment.serverBaseUrl + 'admin/dashBoard';
    dashboardData: any;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        private _analyticsDashboardService: AnalyticsDashboardService
    ) {
        // Register the custom chart.js plugin
        this._registerCustomChartJSPlugin();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the widgets from the service
        this.widgets = AnalyticsDashboardDb.widgets;
        this.getDashboardDetail();
        // this.getGoogleAnalyticsData();
    }

    getGoogleAnalyticsData() {
        this._analyticsDashboardService.getGoogleAnalyticsData()
            .subscribe(
                (response) => {
                    console.log('response', response);
                },
                (error) => {
                    console.log('error', error);
                }
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register a custom plugin
     */
    private _registerCustomChartJSPlugin(): void {
        (window as any).Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing): any {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                ) {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i): any {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index): any {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (window as any).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString();

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }

    getDashboardDetail(): void {

        this._analyticsDashboardService.getDashboardData(this.getUserApiUrl)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if (response.code === 200 && response.data) {
                    this.dashboardData = response.data;
                    this.setStatisticWidget();
                }
            });

    }

    setStatisticWidget(): void {

        const statisticsList = Object.keys(this.dashboardData);
        const monthUserArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const monthTemplateArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (statisticsList.length > 0) {
            statisticsList.forEach((key: string) => {
                if (key !== 'monthTemplate' && key !== 'monthUser') {
                    this.statisticWidget.push(
                        {
                            'ranges': {
                                'DY': 'Yesterday',
                                'DT': 'Today',
                                'DTM': 'Tomorrow'
                            },
                            'currentRange': 'DT',
                            'data': {
                                'label': key.toUpperCase(),
                                'count': {
                                    'DY': 0,
                                    'DT': this.dashboardData[key], // default
                                    'DTM': 0
                                },
                                // 'extra': {
                                //     'label': 'Completed',
                                //     'count': {
                                //         'DY': 6,
                                //         'DT': 7,
                                //         'DTM': '-'
                                //     }
                                // }
                            },
                            'detail': 'You can show some detailed information about this widget in here.'
                        }
                    );
                } else {
                    if (key === 'monthUser') {
                        for (let i = 0; i < this.dashboardData[key].length; i++) {
                            const index = this.dashboardData[key][i]['_id'];
                            const count = this.dashboardData[key][i]['count'];
                            monthUserArray[index - 1] = count;
                        }
                    } else {
                        for (let i = 0; i < this.dashboardData[key].length; i++) {
                            const index = this.dashboardData[key][i]['_id'];
                            const count = this.dashboardData[key][i]['count'];
                            monthTemplateArray[index - 1] = count;
                        }
                    }
                }
            });
            this.widgets.widget1.datasets[this.widget1SelectedYear][0].data = monthUserArray;
            this.widgets.widget5.datasets[this.widget5SelectedDay][0].data = monthTemplateArray;
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

