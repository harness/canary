import { ArrayLike as ArrayLike_2 } from 'd3-selection';
import { Axis as Axis_2 } from 'd3-axis';
import { AxisDomain } from 'd3-axis';
import { AxisScale } from 'd3-axis';
import { BaseType } from 'd3-selection';
import { BehaviorSubject } from 'rxjs';
import { BrushBehavior } from 'd3-brush';
import { ComponentType } from 'react';
import { ContainerElement } from 'd3-selection';
import { Context } from 'react';
import { D3BrushEvent } from 'd3-brush';
import { D3ZoomEvent } from 'd3-zoom';
import { default as default_2 } from 'react';
import { Force } from 'd3-force';
import { HierarchyNode } from 'd3-hierarchy';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { Numeric } from 'd3-array';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { PieArcDatum } from 'd3-shape';
import { PopoverPosition as PopoverPosition_2 } from 'src/popover';
import { ReactNode } from 'react';
import { ScaleBand } from 'd3-scale';
import { ScaleLinear } from 'd3-scale';
import { ScaleLogarithmic } from 'd3-scale';
import { ScaleTime } from 'd3-scale';
import { Selection as Selection_2 } from 'd3-selection';
import { SimulationNodeDatum } from 'd3-force';
import { ZoomBehavior } from 'd3-zoom';
import { ZoomTransform } from 'd3-zoom';

export declare const ACTIVE_TIME_RANGE_PREF_KEY = "active-time-range";

export declare enum AnimationState {
    None = "none",
    Enter = "enter",
    Exit = "exit",
    Update = "update"
}

/**
 * Animation states for donut arcs
 * Maps to: Angular AnimationStates (donut-builder.service.ts lines 380-384)
 */
export declare const enum AnimationStates {
    Entry = 0,
    Exit = 1,
    Update = 2
}

export declare type AnyCartesianScale<TData> = CartesianContinuousScale<TData> | CartesianLogScale<TData> | CartesianTimeScale<TData> | CartesianBandScale<TData>;

export declare interface AutoGroupConfig<TNode extends TopologyNode = TopologyNode> {
    fields?: string[];
    discriminator?: keyof TNode & string;
    rules?: Record<string, AutoGroupRule>;
    defaultRule?: AutoGroupRule;
    minGroupSize?: number;
    maxSubGroupSize?: number;
    maxVisibleUngrouped?: number;
    fieldExtractor?: (node: TNode, field: string) => string | undefined;
    groupTitleBuilder?: (fieldValue: string, field: string, count: number) => string;
    groupColorResolver?: (fieldValue: string, field: string) => string;
}

export declare function autoGroupNodes<TNode extends TopologyNode>(nodes: TNode[], config: AutoGroupConfig<TNode>): TopologyNode[];

export declare interface AutoGroupRule {
    fields: string[];
}

export declare interface Axis<TData = unknown> {
    /**
     * Unique name of the axis (use to group data series to axis)
     */
    name?: string;
    /**
     * Display title for the axis (e.g., "Revenue ($)", "Count")
     */
    title?: string;
    /**
     * Type of axis (i.e. X or Y)
     */
    type: AxisType;
    /**
     * Location to place the axis relative to the chart
     */
    location: AxisLocation;
    /**
     * If true, display grid lines extending from this axis. Default false
     */
    gridLines?: boolean;
    /**
     * If true, display axis line (independent of tick marks). Default true.
     */
    axisLine?: boolean;
    /**
     * If true, display tick labels for this axis. Default true;
     */
    tickLabels?: boolean;
    /**
     * Scale type to use for axis
     */
    scale?: ScaleType;
    /**
     * Track mouse with crosshair
     */
    crosshair?: AxisCrosshair;
    /**
     * Minimum value of the axis. If unset, defaults to minimum value of provided data.
     */
    min?: number;
    /**
     * Maximum value of the axis. If unset, defaults to maximum value of provided data.
     */
    max?: number;
    /**
     * Determine the tick count labels
     */
    tickCount?: number;
    /**
     * What to do if label overflows
     */
    labelOverflow?: LabelOverflow_2;
    /**
     * Custom size of the axis (width or height) depending upon the type (Y or X respectively)
     */
    size?: number;
    getLabel?(domainValue: AxisDomain, index: number): string;
    dataAccessor?: (data: TData) => unknown;
}

export declare interface AxisCrosshair {
    enable: boolean;
    /**
     * If true, snaps to the closest data point to mouse. If false, follows exact mouse location. Defaults to true.
     */
    snap?: boolean;
}

export declare enum AxisLocation {
    Left = 0,
    Right = 1,
    Top = 2,
    Bottom = 3
}

export declare enum AxisType {
    X = 0,
    Y = 1
}

export declare interface Band<TInterval> {
    upper: Series<TInterval>;
    lower: Series<TInterval>;
    color: string;
    opacity: number;
    name: string;
    hide?: boolean;
}

/**
 * Calculate which legends fit in view vs overflow to tooltip
 * Maps to: Angular updateLayout() (lines 196-246)
 *
 * Handles:
 * - Row vs column layout
 * - Width/height constraints
 * - "+X More" text space reservation
 * - Always show at least one legend
 * - Auto-show single overflow legend
 */
export declare function calculateLegendLayout(series: LegendSeries<LegendDataValue>[], containerWidth: number, containerHeight: number, isColumnLayout: boolean): {
    legendsInView: LegendSeries<LegendDataValue>[];
    legendsInTooltip: LegendSeries<LegendDataValue>[];
};

export declare class CartesianArea<TData> extends CartesianSeries<TData> {
    private static readonly CSS_CLASS;
    drawSvg(element: BaseType, animationState?: AnimationState): void;
    drawCanvas(context: CanvasRenderingContext2D): void;
    protected buildMultiAxisDataLookupStrategy(): MouseDataLookupStrategy<TData, Series<TData>>;
    private drawSvgArea;
    private drawCanvasArea;
    private buildArea;
    private buildStartingArea;
    /**
     * Get the height of the datum from the Y value.
     * Matches CartesianColumn.getDatumHeight pattern.
     */
    private getDatumHeight;
    /**
     * Get the Y position for a data point (top of area for stacking).
     * Matches CartesianColumn.getBarOriginY pattern.
     * For stacked series: origin minus height (stacks on top of previous)
     * For non-stacked series: just the raw Y position
     */
    private getDatumY;
    /**
     * Get the baseline Y position for a data point (bottom of area).
     * Uses transformDataOrigin which handles stacking baseline.
     * For stacked series: where the previous series ended
     * For non-stacked series: bottom of chart (range start)
     */
    private getDatumOriginY;
    private buildLine;
    private drawAreaGradient;
    private getColorIdentifier;
}

export declare class CartesianAxis<TData = object, TContext extends Series<TData> | Band<TData> = Series<TData> | Band<TData>> {
    protected readonly scaleBuilder: CartesianScaleBuilder<TData>;
    protected readonly svgUtilService: SvgUtilService;
    private static readonly CSS_CLASS;
    static readonly CSS_SELECTOR: string;
    private static readonly AXIS_TICKS_TEXT_SELECTOR;
    private static readonly AXIS_TICK_PADDING;
    private static readonly MIN_TICK_BANDWIDTH_FOR_LABELS;
    static readonly DEFAULT_X_AXIS_HEIGHT: number;
    static readonly DEFAULT_Y_AXIS_WIDTH: number;
    protected readonly configuration: DefaultedAxisConfig;
    protected readonly crosshair?: CartesianAxisCrosshair<TData, TContext>;
    protected readonly scale: AnyCartesianScale<TData>;
    protected axisElement?: SVGGElement;
    constructor(configuration: Axis, scaleBuilder: CartesianScaleBuilder<TData>, svgUtilService: SvgUtilService);
    draw(element: SVGGElement): this;
    onMouseMove(event: MouseEvent, locationData: MouseLocationData_2<TData, TContext>[]): void;
    onMouseLeave(): void;
    getAxisType(): AxisType;
    getAxisKey(): string;
    protected addTicksToAxis(axis: Axis_2<AxisDomain>): void;
    protected customizeAxis(selection: Selection_2<SVGGElement, unknown, null, undefined>): void;
    private getTextTicksLength;
    private maybeTruncateAxisTicks;
    private hideAllTickLabels;
    private getTickTransformValue;
    private tickTextWrap;
    private rotateAxisTicks;
    private getAxisTransform;
    private getAxisConstructor;
    private calculateAxisTickCount;
    private addGridLinesIfNeeded;
    private addAxisTitleIfNeeded;
    private getAxisTitlePosition;
    private getPerpendicularDistance;
    private applyDefaults;
}

export declare class CartesianAxisCrosshair<TData = unknown, TContext extends Series<TData> | Band<TData> = Series<TData> | Band<TData>> {
    private readonly axisType;
    private readonly axisCrosshair;
    private readonly bounds;
    private readonly crosshairFromAxis;
    constructor(axisType: AxisType, axisCrosshair: AxisCrosshair, bounds: ScaleBounds);
    draw(event: MouseEvent, axisElement: SVGGElement, locationData: MouseLocationData_2<TData, TContext>[]): void;
    hide(axisElement: SVGGElement): void;
    private initializeCrosshairIfMissing;
    private getCrosshairSelection;
    private getCrosshairParentSelection;
    private updatePosition;
    private updateLinePosition;
    private updatePointPosition;
    private getMouseRangeValue;
    private getDataRangeValue;
    private getSnappableData;
}

export declare class CartesianBand<TData> extends CartesianData<TData, Band<TData>> {
    protected readonly d3Utils: D3UtilService;
    protected readonly band: Band<TData>;
    protected readonly scaleBuilder: CartesianScaleBuilder<TData>;
    private static readonly CSS_BAND_CLASS;
    private static readonly CSS_SERIES_CLASS;
    private static readonly LINE_WIDTH;
    constructor(d3Utils: D3UtilService, band: Band<TData>, scaleBuilder: CartesianScaleBuilder<TData>, tooltipTrackingStrategy?: ChartTooltipTrackingOptions);
    protected buildDataLookupStrategy(visualization: Band<TData>, strategy: ChartTooltipTrackingOptions): MouseDataLookupStrategy<TData, Band<TData>>;
    private getCombinedData;
    private getPairedData;
    drawSvg(element: Element): void;
    private drawSvgLine;
    private drawSvgArea;
    private drawSvgPointsIfRequested;
    drawCanvas(context: CanvasRenderingContext2D): void;
    getUniqueCartesianDataKey(): string;
    protected buildMultiAxisDataLookupStrategy(): MouseDataLookupStrategy<TData, Band<TData>>;
    private drawCanvasLine;
    private drawCanvasArea;
    private drawCanvasPointsIfRequested;
    private buildLine;
    private buildArea;
}

declare class CartesianBandScale<TData> extends CartesianScale<TData, string> {
    d3Implementation: D3ScaleForType<ScaleType.Band, string>;
    getScaleType(): ScaleType;
    transformDomain(value: string): number;
    transformToTooltipAnchor(value: TData): number;
    getTickFormatter(): (value: string) => string;
    getBandwidth(): number;
    transformDataOrigin(): number;
    protected setDomain(): void;
    protected setRange(): void;
    protected getEmptyScale(): ScaleBand<string>;
    invert(x: number): number;
}

export declare class CartesianBar<TData> extends CartesianSeries<TData> {
    private static readonly CSS_CLASS;
    private static readonly MAX_BAR_HEIGHT;
    private static readonly MIN_BAR_WIDTH;
    private static readonly BAR_ROUNDING_RADIUS;
    drawSvg(element: BaseType, animationState?: AnimationState): void;
    drawCanvas(context: CanvasRenderingContext2D): void;
    private getColorForDatum;
    protected buildMultiAxisDataLookupStrategy(): MouseDataLookupStrategy<TData, Series<TData>>;
    private drawSvgColumns;
    private getDatumWidth;
    private getBarOriginX;
    private getBarOriginY;
    private getColumnHeight;
    private getOriginYAdjustment;
    private isShowBarTopRounding;
    private generateColumnPathString;
    private addColumnPath;
}

/**
 * CartesianChart - React component for D3-based cartesian visualizations
 *
 * This component provides a complete implementation of cartesian charts including:
 * - Line, Bar, Column, Area, Scatter, and Dashed Line charts
 * - Dual Y-axis support
 * - Interactive tooltips
 * - Crosshairs and hover tracking
 * - Legend with series filtering/toggling
 * - Range selection (brush)
 * - Interval selector
 * - Chart synchronization across multiple charts
 */
export declare function CartesianChart<TData>({ series, bands, xAxisOption, yAxisOption, showYAxis, showXAxis, legend, strategy, timeRange, rangeSelectionEnabled, selectableInterval, intervalOptions, selectedInterval, groupId, tooltipClickAction, padding, dataClickAction, onIntervalChange, onSelectionChange, onDataPointClick, colorPalette, enableTooltips, enableCrosshairs, downsampling, }: CartesianChartProps<TData>): default_2.ReactElement | null;

/**
 * Padding configuration for the chart
 */
export declare interface CartesianChartPadding {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
}

/**
 * Props for the CartesianChart component
 */
export declare interface CartesianChartProps<TData> {
    /** Array of series data to render */
    series?: Series<TData>[];
    /** Array of band data to render */
    bands?: Band<TData>[];
    /** X-axis configuration */
    xAxisOption?: Axis;
    /** Y-axis configuration (single or dual) */
    yAxisOption?: Axis | DualYAxisType;
    /** Show Y-axis */
    showYAxis?: boolean;
    /** Show X-axis */
    showXAxis?: boolean;
    /** Legend position */
    legend?: LegendPosition;
    /** Rendering strategy (SVG or Canvas) */
    strategy?: RenderingStrategy;
    /** Time range for the chart domain */
    timeRange?: TimeRange;
    /** Enable range selection (brush) */
    rangeSelectionEnabled?: boolean;
    /** Enable interval selector */
    selectableInterval?: boolean;
    /** Available interval options */
    intervalOptions?: IntervalValue[];
    /** Currently selected interval */
    selectedInterval?: IntervalValue;
    /** Chart group ID for synchronization */
    groupId?: string;
    /** Tooltip click action config */
    tooltipClickAction?: ChartActionConfig<string, Series<TData>[]>;
    /** Chart padding */
    padding?: Partial<CartesianChartPadding>;
    /** Data point click action config */
    dataClickAction?: ChartActionConfig<TData, Series<TData>>;
    /** Callback when interval selection changes */
    onIntervalChange?: (interval: IntervalValue) => void;
    /** Callback when range selection changes */
    onSelectionChange?: (selection: MouseLocationData_2<TData, Series<TData> | Band<TData>>[] | CartesianSelectedData<TData>) => void;
    /** Callback when data point is clicked */
    onDataPointClick?: (data: TData, series: Series<TData>) => void;
    /** Custom color palette */
    colorPalette?: string[];
    /** Enable tooltips */
    enableTooltips?: boolean;
    /** Enable crosshairs */
    enableCrosshairs?: boolean;
    /** LTTB downsampling configuration. When set, series with more points than dataPointLimit are downsampled. */
    downsampling?: DownsamplingConfig;
}

export declare class CartesianColumn<TData> extends CartesianSeries<TData> {
    private static readonly CSS_CLASS;
    static readonly MIN_COLUMN_WIDTH: number;
    static readonly MAX_COLUMN_WIDTH: number;
    private static readonly MIN_COLUMN_HEIGHT;
    private static readonly COLUMN_ROUNDING_RADIUS;
    private static readonly COLUMN_SPACING;
    drawSvg(element: BaseType, animationState?: AnimationState): void;
    drawCanvas(context: CanvasRenderingContext2D): void;
    private getColorForDatum;
    protected buildMultiAxisDataLookupStrategy(): MouseDataLookupStrategy<TData, Series<TData>>;
    private drawSvgColumns;
    private getDatumHeight;
    private getBarOriginY;
    private getBarOriginX;
    private getColumnWidth;
    private getOriginXAdjustment;
    private generateColumnPathString;
    private addColumnPath;
}

declare class CartesianContinuousScale<TData> extends CartesianNumericScale<TData> {
    d3Implementation: D3ScaleForType<ScaleType.Linear, number>;
    private readonly numberFormatter;
    getScaleType(): ScaleType;
    transformDomain(value: number): number;
    getTickFormatter(): (value: Numeric) => string;
    getTickDistance(): number;
    transformDataOrigin(datum: TData): number;
    protected setDomain(): void;
    protected setRange(): void;
    protected getEmptyScale(): ScaleLinear<number, number>;
    invert(x: number): number;
    transformToTooltipAnchor(value: TData): number;
}

export declare class CartesianDashedLine<TData> extends CartesianLine<TData> {
    private static readonly CSS_DASHED_LINE_CLASS;
    private static readonly DASHED_LINE_WIDTH;
    drawSvg(element: BaseType, animationState?: AnimationState): void;
}

export declare abstract class CartesianData<TData, TVisualization> {
    protected readonly visualization: TVisualization;
    protected readonly scaleBuilder: CartesianScaleBuilder<TData>;
    protected dataLookupStrategy?: MouseDataLookupStrategy<TData, TVisualization>;
    protected xScale: AnyCartesianScale<TData>;
    protected yScale: AnyCartesianScale<TData>;
    protected constructor(visualization: TVisualization, scaleBuilder: CartesianScaleBuilder<TData>, tooltipTrackingStrategy?: ChartTooltipTrackingOptions);
    abstract drawSvg(element: BaseType, animationState?: AnimationState): void;
    abstract drawCanvas(context: CanvasRenderingContext2D): void;
    protected abstract buildMultiAxisDataLookupStrategy(tooltipStrategy: ChartTooltipTrackingOptions): MouseDataLookupStrategy<TData, TVisualization>;
    protected abstract buildDataLookupStrategy(visualization: TVisualization, strategy: ChartTooltipTrackingOptions): MouseDataLookupStrategy<TData, TVisualization>;
    abstract getUniqueCartesianDataKey(): string;
    dataForLocation(location: RelativeMouseLocation_2): MouseLocationData_2<TData, TVisualization>[];
    protected buildXScale(): AnyCartesianScale<TData>;
    protected buildYScale(): AnyCartesianScale<TData>;
    getXAxisValue(x: number): Date;
    protected getDatumKey(datum: TData, axis?: AxisType): string;
}

export declare interface CartesianIntervalData {
    selectableInterval: boolean;
    options: CartesianIntervalValue[];
    initial: CartesianIntervalValue;
    changeObserver: Observer<CartesianIntervalValue>;
}

export declare interface CartesianIntervalValue {
    label: string;
    value: number;
}

export declare class CartesianLine<TData> extends CartesianSeries<TData> {
    private static readonly CSS_LINE_CLASS;
    private static readonly LINE_WIDTH;
    private static readonly DROP_SHADOW_FILTER;
    drawSvg(element: BaseType, animationState?: AnimationState): void;
    drawCanvas(context: CanvasRenderingContext2D): void;
    protected buildMultiAxisDataLookupStrategy(): MouseDataLookupStrategy<TData, Series<TData>>;
    protected drawSvgLine(seriesGroupSelection: Selection_2<SVGGElement, null, BaseType, unknown>, animationState?: AnimationState): void;
    private drawCanvasLine;
    private buildLine;
    private buildStartingLine;
    /**
     * Get the height of the datum from the Y value.
     * Matches CartesianColumn.getDatumHeight pattern.
     */
    private getDatumHeight;
    /**
     * Get the Y position for a data point (line position for stacking).
     * Matches CartesianColumn.getBarOriginY pattern.
     * For stacked series: origin minus height (stacks on top of previous)
     * For non-stacked series: just the raw Y position
     */
    private getDatumY;
    /**
     * Get the baseline Y position for a data point.
     * Uses transformDataOrigin which handles stacking baseline.
     * For stacked series: where the previous series ended
     * For non-stacked series: bottom of chart (range start)
     */
    private getDatumOriginY;
    protected drawSvgPointsIfRequested(seriesGroup: SVGGElement, animationState?: AnimationState): void;
    private drawCanvasPointsIfRequested;
    protected drawSvgVerticalLinesIfRequested(seriesGroupSelection: Selection_2<SVGGElement, null, BaseType, unknown>): void;
}

/**
 * Logarithmic scale for cartesian charts.
 * Useful for data with wide ranges (e.g., 1 to 1,000,000).
 *
 * Note: Log scale cannot handle zero or negative values.
 * Values <= 0 are clamped to a small positive number (0.1).
 */
declare class CartesianLogScale<TData> extends CartesianNumericScale<TData> {
    d3Implementation: D3ScaleForType<ScaleType.Log, number>;
    private readonly numberFormatter;
    private static readonly MIN_LOG_VALUE;
    getScaleType(): ScaleType;
    transformDomain(value: number): number;
    getTickFormatter(): (value: Numeric) => string;
    getTickDistance(): number;
    transformDataOrigin(datum: TData): number;
    protected setDomain(): void;
    protected setRange(): void;
    protected getEmptyScale(): ScaleLogarithmic<number, number>;
    invert(x: number): number;
    transformToTooltipAnchor(value: TData): number;
}

export declare class CartesianNoDataMessage {
    private readonly hostElement;
    private readonly series;
    private readonly message;
    static readonly CSS_CLASS: string;
    static readonly NO_DATA_HIDABLE_CSS_CLASS: string;
    constructor(hostElement: Element, series: Series<unknown>[], message?: string);
    updateMessage(): void;
    private seriesContainData;
}

declare abstract class CartesianNumericScale<TData> extends CartesianScale<TData, Numeric> {
    protected abstract getTickDistance(): number;
    getBandwidth(): number;
    protected getMinMax(): [Numeric, Numeric];
    private getMinAndMaxFromData;
    protected getDataValues(): Numeric[];
    private getClosestDistance;
}

/**
 * CartesianOrchestrator - Framework-agnostic D3 chart orchestrator
 *
 * Manages the complete lifecycle of a cartesian chart using D3:
 * - Series rendering (line, bar, column, area, scatter, dashed-line)
 * - Axis rendering with labels, ticks, gridlines
 * - Crosshair interaction
 * - Band rendering
 * - Brush selection
 * - No-data message display
 */
export declare class CartesianOrchestrator<TData> {
    protected readonly hostElement: Element;
    protected readonly renderingStrategy: RenderingStrategy;
    protected readonly groupId?: string | undefined;
    protected chartContainerElement?: Element;
    protected chartBackgroundSvgElement?: SVGSVGElement;
    protected dataElement?: ContainerElement;
    protected mouseEventContainer?: ContainerElement;
    protected allSeriesData: CartesianData<TData, Series<TData>>[];
    protected allCartesianData: CartesianData<TData, Series<TData> | Band<TData>>[];
    protected renderedAxes: CartesianAxis<TData, Series<TData> | Band<TData>>[];
    protected scaleBuilders: CartesianScaleBuilder<TData>[];
    protected scaleBuildersIndexMapper: Map<string, number>;
    protected readonly padding: Required<CartesianChartPadding>;
    protected readonly svgUtilService: SvgUtilService;
    protected readonly d3Utils: D3UtilService;
    protected legendPosition?: string;
    protected legendElement?: Element;
    protected timeRange?: TimeRange;
    protected readonly requestedAxes: Axis[];
    protected readonly series: Series<TData>[];
    protected readonly bands: Band<TData>[];
    protected readonly eventListeners: {
        event: ChartEvent;
        onEvent: ChartEventListener<TData>;
    }[];
    protected dataClickActionHandler?: (data: TData, context: Series<TData>) => void;
    protected tooltipCallback?: TooltipDisplayCallback<TData>;
    protected legendCallbacks?: LegendCallbacks<TData>;
    protected downsamplingConfig?: DownsamplingConfig;
    private activeSeries;
    private pendingMouseMoveFrame;
    constructor(hostElement: Element, renderingStrategy?: RenderingStrategy, groupId?: string | undefined, padding?: CartesianChartPadding);
    private getCartesianScaleBuilder;
    private addAndReturnCartesianScaleBuilder;
    private updateCartesianScaleBuilder;
    private resetCartesianScales;
    private updateScaleBuilderWithExistingData;
    showCrosshair(event: MouseEvent, locationData: MouseLocationData_2<TData, Series<TData> | Band<TData>>[]): void;
    hideCrosshair(): void;
    getDataAccessor(axisType: AxisType): (data: TData) => string | number | Date;
    protected onBrushSelection(event: D3BrushEvent<unknown>): void;
    destroy(): this;
    /**
     * Clear all registered axes so they can be reconfigured via withAxis().
     * This prevents accumulation when the chart is reconfigured without being recreated.
     */
    clearAxes(): this;
    /**
     * Clear all registered event listeners so they can be reconfigured via withEventListener().
     * This prevents accumulation when the chart is reconfigured without being recreated.
     */
    clearEventListeners(): this;
    clearDownsampling(): this;
    draw(): this;
    isDrawn(): boolean;
    withLegend(legendPosition: string, legendElement?: Element): this;
    withSeries(...series: Series<TData>[]): this;
    /**
     * Update active series (called from legend interaction)
     */
    setActiveSeries(activeSeries: Series<TData>[]): this;
    /**
     * Get current active series
     */
    getActiveSeries(): Series<TData>[];
    updateScaleBuildersWithSeries(series: Series<TData>[]): void;
    withBands(...bands: Band<TData>[]): this;
    updateScaleBuildersWithBands(bands: Band<TData>[]): void;
    withEventListener(eventType: ChartEvent, listener: ChartEventListener<TData>): this;
    withDataClickAction(dataClickActionHandler: (data: TData, context: Series<TData>) => void): this;
    withAxis(axis: Axis): this;
    updateScaleBuildersWithAxes(axes: Axis[]): void;
    withTooltip(tooltipCallback: TooltipDisplayCallback<TData>): this;
    withTimeRange(timeRange: TimeRange): this;
    withDownsampling(config: DownsamplingConfig): this;
    updateScaleBuildersWithTimeRange(timeRange?: TimeRange): void;
    protected drawData(): void;
    protected drawDataSvg(): void;
    protected drawDataCanvas(context: CanvasRenderingContext2D): void;
    protected getChartBox(): Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>;
    protected calculateRange(axisType: AxisType): [number, number];
    protected setupEventListeners(): void;
    protected clear(): void;
    private getPadding;
    private updateData;
    private drawVisualizations;
    private attachBrush;
    private redrawVisualization;
    private moveDataOnTopOfAxes;
    private drawContainer;
    private getXAxes;
    private getYAxes;
    private drawAxes;
    private addNoDataMessageIfNeeded;
    private drawChartBackground;
    private buildCanvasContext;
    private drawMouseEventContainer;
    private getMouseDataForCurrentEvent;
    private getNativeEventName;
    private buildVisualizations;
    private downsampleData;
    private getDownsampledSeries;
    private getDownsampledBands;
    private getChartSeriesVisualization;
    private buildScaleBounds;
    private getTooltipTrackingStrategy;
    private onMouseMove;
    private onMouseLeave;
}

export declare class CartesianPoints<TData> extends CartesianSeries<TData> {
    private static readonly CSS_CLASS;
    drawSvg(element: BaseType, animationState?: AnimationState): void;
    private getColor;
    drawCanvas(context: CanvasRenderingContext2D): void;
    protected buildMultiAxisDataLookupStrategy(): MouseDataLookupStrategy<TData, Series<TData>>;
    private drawSvgSymbols;
    private getSymbolGenerator;
    private lookupSymbolType;
}

declare abstract class CartesianScale<TData, TDomain> {
    readonly axisType: AxisType;
    readonly initData: ScaleInitializationData<TData>;
    d3Implementation: AxisScale<TDomain>;
    private readonly dataAccessor;
    constructor(axisType: AxisType, initData: ScaleInitializationData<TData>);
    transformData(value: TData): number;
    abstract transformDomain(value: TDomain): number;
    abstract getTickFormatter(): (value: TDomain) => string;
    abstract transformDataOrigin(datum: TData): number;
    protected abstract getEmptyScale(): AxisScale<TDomain>;
    abstract getScaleType(): ScaleType;
    protected abstract setDomain(): void;
    protected abstract setRange(): void;
    abstract invert(x: number): Date | number;
    getValueFromData(data: TData): TDomain;
    transformToTooltipAnchor(value: TData): number;
    getRangeStart(): number;
    getRangeEnd(): number;
    abstract getBandwidth(): number;
    getStartBandwidthAdjustment(): number;
    getGroupedColumnSeriesPosition(currentSeries: Series<TData>): number;
    getGroupedColumnSeriesLength(currentSeries: Series<TData>): number;
    isShowColumnRounding(currentSeries: Series<TData>): boolean;
    protected buildScale(): void;
    protected buildRange(): [number, number];
}

export declare class CartesianScaleBuilder<TData> {
    private readonly scaleState;
    static newBuilder<TData>(): CartesianScaleBuilder<TData>;
    private constructor();
    withScaleType(scaleType?: ScaleType): this;
    withDefaultXRange(xMinMax?: MinMax): this;
    withDefaultYRange(yMinMax?: MinMax): this;
    withAxis(axis: Axis): this;
    withXDataAccessor(dataAccessor: (data: TData) => unknown): this;
    withYDataAccessor(dataAccessor: (data: TData) => unknown): this;
    withSeries(series: Series<TData>[]): this;
    withBands(bands: Band<TData>[]): this;
    withBounds(bounds: ScaleBounds): this;
    build(axisType: AxisType): AnyCartesianScale<TData>;
    buildScaleInitData(axisType: AxisType): ScaleInitializationData<TData>;
    getDataAccessorForDomain(axisType: AxisType): <TDomain>(data: TData) => TDomain;
    private getDataAccessor;
    private getXDataAccessor;
    private getYDataAccessor;
    private getScaleType;
    private getFirstDataValue;
    private buildSeriesState;
    private buildStackingState;
    private getAxis;
    private resolveMinMax;
    private getDefaultMinMax;
    private get bounds();
    private get allSeriesAndBandSeries();
    private get data();
    private cloneWith;
}

export declare interface CartesianSelectedData<TData> {
    timeRange: TimeRange;
    selectedData: MouseLocationData_2<TData, Series<TData> | Band<TData>>[];
    location: {
        x: number;
        y: number;
    };
}

export declare abstract class CartesianSeries<TData> extends CartesianData<TData, Series<TData>> {
    readonly series: Series<TData>;
    protected readonly scaleBuilder: CartesianScaleBuilder<TData>;
    protected dataLookupStrategy?: MouseDataLookupStrategy<TData, Series<TData>>;
    protected dataClickActionHandler?: (data: TData, context: Series<TData>) => void;
    constructor(series: Series<TData>, scaleBuilder: CartesianScaleBuilder<TData>, tooltipTrackingStrategy?: ChartTooltipTrackingOptions, dataClickActionHandler?: (data: TData, context: Series<TData>) => void);
    protected buildDataLookupStrategy(visualization: Series<TData>, strategy: ChartTooltipTrackingOptions): MouseDataLookupStrategy<TData, Series<TData>>;
    getUniqueCartesianDataKey(): string;
}

export declare enum CartesianSeriesVisualizationType {
    Bar = "bar",
    Column = "column",
    Line = "line",
    DashedLine = "dashed-line",
    Scatter = "scatter",
    Area = "area"
}

/**
 * CartesianSkeleton - Router component for cartesian chart skeletons
 * Renders appropriate skeleton based on visualization type
 */
export declare const CartesianSkeleton: default_2.FC<CartesianSkeletonProps>;

export declare interface CartesianSkeletonProps extends ColumnSkeletonProps {
    /** Series visualization type - determines which skeleton to render */
    type?: CartesianSeriesVisualizationType;
}

declare class CartesianTimeScale<TData> extends CartesianNumericScale<TData> {
    d3Implementation: D3ScaleForType<ScaleType.Time, Numeric>;
    getScaleType(): ScaleType;
    transformDomain(value: Numeric): number;
    getTickFormatter(): (value: Numeric) => string;
    transformDataOrigin(): number;
    getStartBandwidthAdjustment(): number;
    private getFormatter;
    /**
     * Determines the optimal format mode by checking which level of granularity
     * is needed to make all tick labels unique
     */
    private determineOptimalFormatMode;
    /**
     * Infer the best format based on the date range when we can't check for duplicates
     */
    private inferFormatFromDateRange;
    /**
     * Checks if all tick labels would be unique with the given format mode
     */
    private areLabelsUnique;
    getTickDistance(): number;
    protected setDomain(): void;
    protected setRange(): void;
    protected getEmptyScale(): ScaleTime<number, number>;
    invert(x: number): Date;
}

export declare const CHART_VISUALIZATION_CLASS = "chart-visualization";

/**
 * Chart action config for tooltip/data click
 */
export declare interface ChartActionConfig<TData, TContext> {
    type?: string;
    onClick?: (data: TData, context: TContext) => void;
    buildNavigationParam?: (data: TData, context: TContext) => Promise<unknown> | unknown;
}

/**
 * Union type for chart actions
 * Maps to: ChartActionConfig (chart-tooltip.ts lines 9-11)
 */
declare type ChartActionConfig_2<TData, TContext> = ChartLinkActionConfig<TData, TContext> | ChartCustomActionConfig<TData, TContext>;

/**
 * Custom action configuration
 * Maps to: ChartCustomActionConfig (chart-tooltip.ts lines 18-23)
 */
export declare interface ChartCustomActionConfig<TData, TContext> {
    type: ChartLinkActionConfigType.Custom;
    icon?: string;
    label?: string;
    onClick: (data: TData, context: TContext) => void;
}

export declare enum ChartEvent {
    Click = 0,
    DoubleClick = 1,
    RightClick = 2,
    Hover = 3,
    Select = 4,
    MouseLeave = 5
}

export declare type ChartEventListener<TData> = (data?: MouseLocationData_2<TData, Series<TData> | Band<TData>>[] | CartesianSelectedData<TData>, event?: unknown) => void;

export declare interface ChartInstance {
    id: string;
    groupId: string;
    showCrosshair: (event: MouseEvent, x: number, y: number, data?: any[]) => void;
    hideCrosshair: () => void;
}

/**
 * Legend positioning
 */
export declare enum ChartLegendPosition {
    Bottom = "bottom",
    Right = "right",
    TopRight = "top-right",
    TopLeft = "top-left",
    Top = "top",
    Left = "left",
    Auto = "auto",
    None = "none"
}

/**
 * Link action configuration
 * Maps to: ChartLinkActionConfig (chart-tooltip.ts lines 13-16)
 */
export declare interface ChartLinkActionConfig<TData, TContext> {
    type: ChartLinkActionConfigType.Link;
    buildNavigationParam: (data: TData, context: TContext) => Promise<string | undefined>;
}

/**
 * Chart action types
 * Maps to: ChartLinkActionConfigType (chart-tooltip.ts lines 25-28)
 */
export declare enum ChartLinkActionConfigType {
    Link = "link",
    Custom = "custom"
}

export declare const ChartSyncManager: ChartSyncManagerClass;

/**
 * Global Chart Sync Manager (Singleton)
 */
declare class ChartSyncManagerClass {
    private charts;
    private eventHandlers;
    /**
     * Register a chart for synchronization
     */
    register(chart: ChartInstance): void;
    /**
     * Unregister a chart
     */
    unregister(chart: ChartInstance): void;
    /**
     * Broadcast crosshair move event to all charts in group
     */
    broadcastCrosshairMove(sourceChart: ChartInstance, event: MouseEvent, x: number, y: number, data?: unknown[]): void;
    /**
     * Broadcast crosshair hide event
     */
    broadcastCrosshairHide(sourceChart: ChartInstance): void;
    /**
     * Subscribe to sync events
     */
    on(eventName: string, handler: (...args: unknown[]) => void): () => void;
    /**
     * Trigger event
     */
    private triggerEvent;
    /**
     * Get all charts in a group
     */
    getGroupCharts(groupId: string): ChartInstance[];
    /**
     * Clear all registrations
     */
    clear(): void;
}

/**
 * Chart tooltip configuration
 * Maps to: ChartTooltipConfig (chart-tooltip.ts lines 4-7)
 */
export declare interface ChartTooltipConfig<TData, TContext> {
    dataAction?: ChartActionConfig_2<TData, TContext>;
    titleAction?: ChartActionConfig_2<string, TContext[]>;
}

/**
 * Data mapper function type
 * Maps to: ChartTooltipDataMapper (chart-tooltip-builder.service.ts lines 21-23)
 */
export declare type ChartTooltipDataMapper<TData, TContext, TRenderData> = (data: MouseLocationData<TData, TContext>[]) => TRenderData | undefined;

/**
 * Chart tooltip reference interface
 * Maps to: ChartTooltipRef (chart-tooltip-popover.ts lines 129-137)
 */
export declare interface ChartTooltipRef<TData, TContext = unknown> {
    showWithData(relativeTo: Element, data: MouseLocationData<TData, TContext>[], relativeLocation: RelativeMouseLocation_3, popoverPosition?: PopoverPosition_2): void;
    hide(): void;
    destroy(): void;
}

export declare interface ChartTooltipTrackingOptions {
    followSingleAxis?: AxisType;
    radius?: number;
}

declare type ClientRectBounds = Omit<DOMRect, 'x' | 'y' | 'toJSON'>;

declare abstract class Coercer<T, TOptions extends CoercerOptions<T>> {
    protected readonly options: Readonly<TOptions>;
    constructor(options: TOptions);
    protected abstract tryCoerceSingleValue(value: unknown): T | undefined;
    coerce(value: unknown): T | undefined;
    protected assignDefaults(options: TOptions): TOptions;
    canCoerce(value: unknown): boolean;
    protected collectValuesToCheck(value: unknown): unknown[];
    protected extractObjectKeys(value: unknown): unknown[];
    protected extractArrayIndices(value: unknown): unknown[];
}

declare interface CoercerOptions<T> {
    defaultValue?: T;
    extractObjectKeys?: string[];
    extractArrayIndices?: number[];
    maxArrayLength?: number;
    useSelf?: boolean;
}

export declare const collapseWhitespace: (str: string) => string;

export declare class ColorService {
    private colors;
    constructor(colors?: string[]);
    /**
     * Get the human-readable label for a VizColor value (e.g., VizColor.Blue → "Blue")
     */
    static getVizColorLabel(color: string | VizColor): string | undefined;
    static getDropShadowColor(color: string | VizColor, _size?: ShadowSize): string;
    getColorPalette(): {
        forNColors: (count: number) => string[];
    };
    /**
     * Get a single color by index
     */
    getColor(index: number): string;
    /**
     * Get all available colors
     */
    getAllColors(): string[];
}

/**
 * ColumnSkeleton - Loading skeleton for column/bar chart widgets
 * Displays vertical bars with shimmer animation,
 * optional title, legend bar, and loading text
 */
export declare const ColumnSkeleton: default_2.FC<ColumnSkeletonProps>;

export declare interface ColumnSkeletonProps {
    /** Show/hide the top-left title skeleton box */
    showTitle?: boolean;
}

/**
 * Computes the previous (reference) time range by shifting the current window
 * backward by its own duration.
 *
 * @example
 * // Relative: current is last 1 day → previous is the day before that
 * computePreviousTimeRange("1d")
 *
 * @example
 * // Fixed: current is [A, B] → previous is [A - (B-A), A]
 * computePreviousTimeRange("1704067200000-1704153600000")
 *
 * @param value - The time range value string (relative or fixed)
 * @param options - Optional parsing options (e.g., stabilizeTimeRange)
 * @returns Object with startTime and endTime as epoch ms strings for the previous window, or undefined
 */
export declare function computePreviousTimeRange(value: string, options?: ParseTimeRangeOptions): {
    startTime: string;
    endTime: string;
} | undefined;

/**
 * Converts gauge segment data to tooltip render data format.
 * Used by useChartTooltip hook to display segment information on hover.
 *
 * @param data - Array of mouse location data containing GaugeTooltipData
 * @returns Formatted tooltip render data or undefined if no data
 */
export declare const convertGaugeTooltipData: (valueFormatOptions: ValueFormatOptions) => (data: MouseLocationData<GaugeTooltipData, undefined>[]) => DefaultChartTooltipRenderData<GaugeTooltipData, undefined> | undefined;

declare type ConvertibleTimeUnit = TimeUnit.Year | TimeUnit.Month | TimeUnit.Week | TimeUnit.Day | TimeUnit.Hour | TimeUnit.Minute | TimeUnit.Second | TimeUnit.Millisecond;

/**
 * Chart Synchronization Manager
 *
 * Manages crosshair and tooltip synchronization across multiple charts with the same groupId
 * Generic utility that can be used by any chart type (cartesian, pie, gauge, etc.)
 *
 * Features:
 * - Shared crosshair across multiple charts
 * - Synchronized tooltips
 * - Group-based isolation
 * - Event-driven architecture
 * - React-friendly (no RxJS required)
 *
 * @module ChartSyncManager
 */
export declare interface CrosshairEvent {
    groupId: string;
    x: number;
    y: number;
    event: MouseEvent;
    data?: any[];
}

export declare class CustomForceBuilder<TNode extends D3ProxyNode_2 = D3ProxyNode_2, TEdge extends D3ProxyEdge<TNode> = D3ProxyEdge<TNode>> {
    buildEdgeDirectionalityForce(edges: TEdge[], strength?: number): Force<TNode, TEdge>;
    buildStraightEdgeForce(edges: TEdge[], strength?: number): Force<TNode, TEdge>;
    private applyDirectionalityToEdge;
    private applyFlatteningForceToEdge;
    private changeNodeVelocity;
    private getRelativeEdgeImportanceForSource;
    private getRelativeEdgeImportanceForTarget;
    private getTopologySizeFactor;
}

export declare class CustomTreeLayout extends TreeLayout {
    layout(topology: RenderableTopology<TopologyNode, TopologyEdge>): void;
    private updateLayout;
}

declare interface D3EventTriggerConfig {
    requireModifiers?: ZoomEventKeyModifier[];
}

declare interface D3ProxyEdge<TNode extends D3ProxyNode_2 = D3ProxyNode_2> {
    source: TNode;
    target: TNode;
}

declare interface D3ProxyNode {
    sourceNode: RenderableTopologyNode | undefined;
    hasIncomingEdges: boolean;
    children: D3ProxyNode[];
    x: number;
    y: number;
}

declare interface D3ProxyNode_2 extends SimulationNodeDatum {
    sourceNode: RenderableTopologyNode;
    x: number;
    y: number;
}

declare type D3ScaleForType<T extends keyof D3ScaleTypeMap, TDomain> = D3ScaleTypeMap[T] & AxisScale<TDomain>;

declare interface D3ScaleTypeMap {
    [ScaleType.Linear]: ScaleLinear<number, number>;
    [ScaleType.Log]: ScaleLogarithmic<number, number>;
    [ScaleType.Time]: ScaleTime<number, number>;
    [ScaleType.Band]: ScaleBand<string>;
}

export declare class D3Topology implements TopologyInterface {
    protected readonly hostElement: Element;
    protected readonly config: TopologyConfiguration;
    private static readonly CONTAINER_CLASS;
    private static readonly SVG_CLASS;
    private static readonly DATA_CLASS;
    protected destroyCallbacks: (() => void)[];
    protected topologyData: RenderableTopology<TopologyNode, TopologyEdge>;
    protected readonly zoom: TopologyZoom<SVGSVGElement, SVGGElement>;
    protected readonly drag: TopologyNodeDrag;
    protected readonly hover: TopologyHover;
    protected readonly click: TopologyClick;
    protected readonly stateManager: TopologyStateManager;
    protected readonly dataClearCallbacks: (() => void)[];
    protected container?: HTMLDivElement;
    protected tooltipCallbacks?: TopologyTooltipCallbacks;
    protected layout: TopologyLayout;
    protected readonly supportGroupNode: boolean;
    protected readonly enableDemarcation: boolean;
    protected userNodes: TopologyNode[];
    protected readonly nodeRenderer: TopologyNodeRenderer;
    protected readonly edgeRenderer: TopologyEdgeRenderer;
    protected readonly d3Util: D3UtilService;
    protected width: number;
    protected height: number;
    private readonly topologyConverter;
    private readonly neighborhoodFinder;
    private readonly demarcationRenderer;
    constructor(hostElement: Element, config: TopologyConfiguration);
    getStateManager(): TopologyStateManager;
    getZoom(): TopologyZoom<SVGSVGElement, SVGGElement>;
    getConfig(): TopologyConfiguration;
    getCurrentTopology(): RenderableTopology<TopologyNode, TopologyEdge>;
    relayout(): void;
    private initializeLayout;
    draw(): this;
    destroy(): void;
    onDestroy(destroyFn: () => void): this;
    private readonly updatePositions;
    private updateRenderedState;
    private updateLayout;
    private initializeContainer;
    private drawData;
    private drawNodesAndEdges;
    private updateMeasuredDimensions;
    private runAndDrainCallbacks;
    private clearAndDrawNewData;
    private onNodeHoverEvent;
    private onEdgeHoverEvent;
    private resetVisibility;
    private emphasizeTopologyNeighborhood;
    private getHoverEndEventsFromConfig;
    private onNodeClick;
    private checkAndHandleGroupNodeClick;
    private collapseGroupNodesIfPresent;
    private convertTopology;
    private onEdgeClick;
    private onNodeDrag;
    private showNodeTooltip;
    private showEdgeTooltip;
}

declare class D3UtilService {
    getNamespaceUri(namespaceShorthand: SupportedNamespace): string;
    select<TElement extends Element, TData = unknown>(selector: string | TElement): Selection_2<TElement, TData, any, any>;
    selectAll<TElement extends Element, TData = unknown>(selector: string | ArrayLike_2<TElement> | Element[]): Selection_2<TElement, TData, null, undefined>;
}

declare abstract class D3Zoom<TContainer extends Element = Element, TTarget extends Element = Element> {
    protected static readonly DEFAULT_MIN_ZOOM: number;
    protected static readonly DEFAULT_MAX_ZOOM: number;
    protected static readonly DATA_BRUSH_CONTEXT_CLASS: string;
    protected static readonly DATA_BRUSH_OVERLAY_CLASS: string;
    protected static readonly DATA_BRUSH_SELECTION_CLASS: string;
    protected static readonly DATA_BRUSH_OVERLAY_WIDTH: number;
    protected static readonly DATA_BRUSH_OVERLAY_HEIGHT: number;
    protected config?: InternalD3ZoomConfiguration<TContainer, TTarget>;
    protected readonly zoomBehavior: ZoomBehavior<TContainer, unknown>;
    protected readonly zoomChangeSubject: BehaviorSubject<number>;
    protected readonly brushBehaviour: BrushBehavior<unknown>;
    readonly zoomChange$: Observable<number>;
    protected get minScale(): number;
    protected get maxScale(): number;
    constructor();
    attachZoom(configuration: D3ZoomConfiguration<TContainer, TTarget>): this;
    getZoomScale(): number;
    setZoomScale(factor: number): void;
    resetZoom(): void;
    canIncreaseScale(): boolean;
    canDecreaseScale(): boolean;
    zoomToRect(requestedRect: ClientRectBounds, maxScale?: number): void;
    panToRect(viewRect: ClientRectBounds): void;
    protected showBrushOverlay(overlayZoomScale?: number): void;
    protected styleBrushSelection(brushSelection: Selection_2<SVGGElement, unknown, null, undefined>, overlayZoomScale: number): void;
    protected onBrushSelection(event: D3BrushEvent<unknown>): void;
    translateToRect(rect: ClientRectBounds): void;
    protected updateZoom(transform: ZoomTransform): void;
    protected checkValidZoomEvent(receivedEvent: ZoomSourceEvent): boolean;
    protected isValidTriggerEvent(receivedEvent: TouchEvent | MouseEvent, triggerConfig?: D3EventTriggerConfig): boolean;
    protected eventHasModifier(receivedEvent: TouchEvent | MouseEvent, modifier: ZoomEventKeyModifier): boolean;
    protected isPrimaryMouseOrTouchEvent(receivedEvent: ZoomSourceEvent): receivedEvent is TouchEvent | MouseEvent;
    protected isScrollEvent(receivedEvent: ZoomSourceEvent): receivedEvent is WheelEvent;
    protected updateDraggingClassIfNeeded(zoomEvent: ZoomHandlerEvent): void;
    protected isPanStartEvent(zoomEvent: ZoomHandlerEvent): boolean;
    protected getTargetSelectionOrThrow(): Selection_2<TTarget, unknown, null, unknown>;
    protected getContainerSelectionOrThrow(): Selection_2<TContainer, unknown, null, unknown>;
}

declare interface D3ZoomConfiguration<TContainer extends Element, TTarget extends Element> {
    container: Selection_2<TContainer, unknown, null, undefined>;
    target: Selection_2<TTarget, unknown, null, undefined>;
    scroll?: D3EventTriggerConfig;
    pan?: D3EventTriggerConfig;
    showBrush?: boolean;
    minScale?: number;
    maxScale?: number;
}

export declare function DashboardUiVisualization(): JSX_2.Element;

export declare const DATA_SERIES_CLASS = "data-series";

export declare class DateCoercer extends Coercer<Date, DateCoercerOptions> {
    private static readonly DEFAULT_TIME_WINDOW;
    constructor(options?: DateCoercerOptions);
    protected assignDefaults(options: DateCoercerOptions): DateCoercerOptions;
    protected tryCoerceSingleValue(value: unknown): Date | undefined;
    private isDateInAllowableRange;
}

declare interface DateCoercerOptions extends CoercerOptions<Date> {
    earliestDate?: Date;
    latestDate?: Date;
}

export declare const enum DateFormatMode {
    /**
     * `h:mm a` -> `11:11 AM`
     */
    TimeOnly = 0,
    /**
     * `hh:mm:ss a` -> `11:11:00 AM`
     */
    TimeWithSeconds = 1,
    /**
     * `d MMM y` -> `11 Nov 1990`
     */
    DateOnly = 2,
    /**
     * `MMM d` -> `Nov 11`
     */
    MonthAndDayOnly = 3,
    /**
     * `MMM yy` -> `Nov 90`
     */
    MonthAndYearOnly = 4,
    /**
     * `MMMM yyyy` -> `November 1990`
     */
    FullMonthAndYearOnly = 5,
    /**
     * `d MMM y h:mm a` -> `11 Nov 1990 11:11 AM`
     */
    DateWithYearAndTime = 6,
    /**
     * `y-MM-dd hh:mm:ss a` -> `1990-11-11 11:11:00 AM`
     */
    DateAndTimeWithSeconds = 7,
    /**
     * `d MMM h:mm a` -> `11 Nov 11:11 AM`
     */
    DateOnlyAndTime = 8,
    /**
     * `d MMM y h:mm a zzzz` -> `11 Nov 1990 11:11 AM UTC+00:30`
     */
    DateWithYearAndTimeWithTimeZone = 9,
    /**
     * `HH:mm:ssZZZZZ` -> `21:00:00Z` or `21:00:00-08:00`
     */
    TimeWithTimeZoneOffset = 10,
    /**
     * `yyyy-mm-dd` -> `1990-11-11`
     */
    DateWithYearAndMonth = 11
}

declare interface DateFormatOptions {
    mode?: DateFormatMode;
}

export declare class DateFormatter {
    private static readonly DEFAULT_OPTIONS;
    protected readonly options: Readonly<Required<DateFormatOptions>>;
    private readonly dateCoercer;
    constructor(options?: DateFormatOptions);
    format(value: Date | number | undefined | string, timezone?: string): string;
    protected applyOptionDefaults(options: DateFormatOptions): Readonly<Required<DateFormatOptions>>;
    protected convertDateToString(value: Date | number | string | undefined, timezone?: string): string;
    private formatDateWithMode;
    private getTimezoneOffset;
    protected getFormatString(): string;
}

declare type DateOrMillis = Date | number;

declare type DeepReadonly<T> = T extends (infer R)[] ? DeepReadonlyArray<R> : T extends Function ? T : T extends object ? DeepReadonlyObject<T> : T;

declare type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

declare type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

/**
 * Chart constants
 * Extracted from DefaultCartesianChart to remove circular dependencies
 */
export declare const DEFAULT_CARTESIAN_ANIMATION_DURATION = 150;

export declare const DEFAULT_CARTESIAN_AXIS_GROUP_NAME = "common";

export declare const DEFAULT_TIME_RANGE: TimeRange;

/**
 * Default chart tooltip component
 * Maps to: Angular DefaultChartTooltipComponent
 */
export declare function DefaultChartTooltip<TData, TContext>({ data, }: DefaultChartTooltipProps<TData, TContext>): JSX_2.Element;

declare interface DefaultChartTooltipProps<TData, TContext> {
    data: DefaultChartTooltipRenderData<TData, TContext>;
    onDrilldown?: (data: TData, context: TContext) => void;
    onTitleDrilldown?: (title: string, contexts: TContext[]) => void;
}

/**
 * Tooltip render data for default component
 * Maps to: DefaultChartTooltipRenderData (default-chart-tooltip.component.ts lines 163-168)
 */
export declare interface DefaultChartTooltipRenderData<TData, TContext> {
    /** Chart type identifier for analytics/tracking */
    chartType?: string;
    /** Title displayed at bottom of tooltip (e.g., timestamp) */
    title?: string;
    /** Groups of labeled values */
    groups: TooltipGroup<TData, TContext>[];
    /** Action configuration for drilldown/filtering */
    config?: ChartTooltipConfig<TData, TContext>;
}

declare type DefaultedAxisConfig = Axis & Omit<Required<Axis>, 'name' | 'title' | 'scale' | 'crosshair' | 'min' | 'max' | 'tickCount' | 'labelOverflow' | 'getLabel'>;

export declare class DefaultEdgeRenderer implements TopologyEdgeRenderDelegate<DefaultTopologyEdge> {
    matches(edge: TopologyEdge): edge is DefaultTopologyEdge;
    draw(parentElement: SVGGElement, edge: DefaultTopologyEdge, position: TopologyEdgePositionInformation, state: TopologyEdgeState): void;
    updatePosition(parentElement: SVGGElement, _edge: DefaultTopologyEdge, position: TopologyEdgePositionInformation): void;
    updateState(parentElement: SVGGElement, edge: DefaultTopologyEdge, state: TopologyEdgeState): void;
    private defineArrowMarker;
}

export declare interface DefaultGroupNodeData extends TopologyGroupNodeData {
    color?: string;
}

export declare class DefaultGroupNodeRenderer implements TopologyNodeRendererDelegate<TopologyGroupNode<DefaultGroupNodeData>> {
    matches(node: TopologyNode): node is TopologyGroupNode<DefaultGroupNodeData>;
    draw(parentElement: SVGGElement, node: TopologyGroupNode<DefaultGroupNodeData>, state: TopologyNodeState): void;
    updateState(parentElement: SVGGElement, _node: TopologyGroupNode<DefaultGroupNodeData>, state: TopologyNodeState): void;
    destroy(_node: TopologyGroupNode<DefaultGroupNodeData>): void;
    height(_node: TopologyGroupNode<DefaultGroupNodeData>): number;
    width(_node: TopologyGroupNode<DefaultGroupNodeData>): number;
    getAttachmentPoint(angleRad: number, _node: TopologyGroupNode<DefaultGroupNodeData>): TopologyCoordinates;
    private defineFilters;
}

/**
 * Default logger implementation using console
 * Maps to: Angular LoggerService methods (lines 13-36)
 */
export declare const defaultLogger: Logger;

/**
 * Default navigation implementation using window.location
 * Maps to: Angular NavigationService.navigate() (lines 2-4)
 */
export declare const defaultNavigation: Navigation;

export declare class DefaultNodeRenderer implements TopologyNodeRendererDelegate<DefaultTopologyNode> {
    private readonly svgUtils;
    private readonly onFilterClick?;
    private readonly nodeElementMap;
    constructor(options?: DefaultNodeRendererOptions);
    matches(node: TopologyNode): node is DefaultTopologyNode;
    draw(parentElement: SVGGElement, node: DefaultTopologyNode, state: TopologyNodeState): void;
    updateState(parentElement: SVGGElement, _node: DefaultTopologyNode, state: TopologyNodeState): void;
    destroy(_node: DefaultTopologyNode): void;
    height(_node: DefaultTopologyNode): number;
    width(_node: DefaultTopologyNode): number;
    getAttachmentPoint(angleRad: number, _node: DefaultTopologyNode): TopologyCoordinates;
    private defineFilters;
}

declare interface DefaultNodeRendererOptions {
    onFilterClick?: (node: DefaultTopologyNode) => void;
}

export declare interface DefaultTopologyEdge extends TopologyEdge {
    edgeType: 'default-edge';
    label?: string;
    color?: string;
}

export declare interface DefaultTopologyNode extends TopologyNode {
    nodeType: 'default-node';
    name: string;
    type?: string;
    icon?: string;
    color?: string;
}

export declare class DisplayFileSizeFormatter {
    transform(sizeInBytes: number): string;
}

export declare class DisplayNumberPipe {
    private static readonly INTEGER_FORMATTER;
    private static readonly FLOAT_FORMATTER;
    transform(value: unknown, style?: FormatterStyle): string;
    private getFormatter;
    private isInteger;
}

export declare const displayString: (provided?: unknown, defaultValue?: string, isEmptyValid?: boolean) => string;

export declare const displayStringEnum: (provided?: string, defaultValue?: string) => string;

export declare class DisplayTimeAgo {
    private readonly dateCoercer;
    transform(value?: DateOrMillis | null, suffix?: string, dateCoercer?: DateCoercer): string;
    private calcSecondsAgo;
}

declare class DomElementMeasurerService {
    measureSvgElement(element: SVGGraphicsElement): DOMRect;
    getComputedTextLength(element: SVGTextElement): number;
    measureHtmlElement(element: HTMLElement): DOMRect;
}

/**
 * Donut alignment style enum
 * Maps to: Angular DonutAlignmentStyle (donut.ts lines 46-50)
 */
export declare enum DonutAlignmentStyle {
    Left = "left-alignment",
    Center = "center-alignment",
    Right = "right-alignment"
}

/**
 * DonutBuilderService - Main service for building and managing donut charts
 * Maps to: Angular DonutBuilderService (donut-builder.service.ts)
 *
 * Refactored from Angular to be framework-agnostic:
 * - Removed @Injectable() decorator
 * - Services instantiated in constructor instead of DI
 * - Tooltip uses callback-based approach instead of ChartTooltipBuilderService
 */
export declare class DonutBuilderService {
    private static readonly DONUT_CHART_SVG_CLASS;
    private static readonly DONUT_ARC_GROUP_CLASS;
    private static readonly DONUT_VALUE_TEXT_GROUP_CLASS;
    private static readonly DONUT_VALUE_TITLE_CLASS;
    private static readonly DONUT_VALUE_CLASS;
    private static readonly DONUT_ARC_CLASS;
    private static readonly OUTER_CONTAINER_CLASS;
    private static readonly VISUALIZATION_CONTAINER_CLASS;
    private static readonly DONUT_PADDING_PX;
    private static readonly MIN_FONT_SIZE_FOR_TITLE;
    private static readonly MAX_FONT_SIZE_FOR_TITLE;
    private static readonly MAX_FONT_SIZE_FOR_VALUE;
    private static readonly MONO_CHAR_WIDTH_RATIO;
    private readonly colorService;
    private readonly measurer;
    private tooltipRef?;
    constructor(colorPalette?: string[]);
    /**
     * Set the tooltip ref from the useChartTooltip hook
     */
    setTooltipRef(ref: ChartTooltipRef<DonutSeries, undefined>): void;
    /**
     * Get the tooltip ref
     */
    getTooltipRef(): ChartTooltipRef<DonutSeries, undefined> | undefined;
    /**
     * Builds a donut chart in the given container
     * Returns undefined if container has invalid dimensions
     */
    buildChart(chartContainer: HTMLElement, configuration: DonutConfiguration): DonutObject | undefined;
    /**
     * Redraws the chart with new dimensions
     */
    reflow(containerSelection: DonutContainerSelection, config?: DonutConfiguration): void;
    /**
     * Redraws visualization with new config
     */
    redraw(containerSelection: DonutContainerSelection, config: DonutConfiguration): void;
    /**
     * Clears the chart from the container
     */
    clear(parentSelection: DonutContainerSelection): void;
    /**
     * Static method to convert tooltip data
     * Can be passed to useChartTooltip hook
     */
    static convertToDefaultTooltipRenderData(data: MouseLocationData<DonutSeries, undefined>[]): DefaultChartTooltipRenderData<DonutSeries, undefined> | undefined;
    private draw;
    private drawOuterContainer;
    /**
     * Draw the initial SVG structure
     * Maps to: Angular drawVisualization (lines 202-226)
     */
    private drawVisualization;
    /**
     * Update visualization with arc animations
     * Maps to: Angular updateVisualization (lines 71-160)
     */
    protected updateVisualization(visualizationContainer: Selection_2<HTMLDivElement, unknown, null, undefined>, dimensions: DonutDimensions, config: InternalConfiguration): void;
    /**
     * Largest font size that keeps `text` within `maxWidth`
     * using monospace character width, capped by `upperBound`.
     */
    static calcFontSizeForText(text: string, maxWidth: number, upperBound: number): number;
    /**
     * Update visualization size
     * Maps to: Angular updateVisualizationSize (lines 162-200)
     */
    protected updateVisualizationSize(visualizationContainer: Selection_2<HTMLDivElement, unknown, null, undefined>, dimensions: DonutDimensions, config: InternalConfiguration): void;
    /**
     * Calculate minimum visible value for arcs
     * Maps to: Angular getMinimumVisibleValue (lines 228-233)
     */
    private getMinimumVisibleValue;
    /**
     * Calculate animation start position for arc
     * Maps to: Angular animationStartPieDatumValue (lines 330-356)
     */
    private animationStartPieDatumValue;
    /**
     * Decorate calculated dimensions with donut-specific values
     * Maps to: Angular decorateDimensions (lines 235-249)
     */
    protected decorateDimensions(calculatedDimensions: {
        visualizationWidth: number;
        visualizationHeight: number;
        legendWidth: number;
        legendHeight: number;
    }): DonutDimensions;
    /**
     * Fill configuration with defaults
     * Maps to: Angular fillConfigurationDefaults (lines 251-270)
     */
    protected fillConfigurationDefaults(provided: DonutConfiguration): InternalConfiguration;
    /**
     * Measure container and calculate dimensions
     * Inlined from D3VisualizationBuilderService.measure()
     * Note: In React version, legend is handled by React component, so no config needed
     */
    private measure;
    /**
     * Update size
     */
    private updateSize;
    /**
     * Add tooltip tracking to the arc group
     */
    private maybeAddTooltipTracking;
    /**
     * Destroy any existing chart
     */
    private destroyAnyExistingChart;
    /**
     * Get existing config from chart object
     */
    private getExistingConfig;
}

/**
 * Donut center text configuration.
 * Extends ValueFormatOptions to support custom formatting of the center value.
 * Maps to: Angular DonutCenter (donut.ts lines 36-39)
 */
export declare interface DonutCenter extends ValueFormatOptions {
    title: string;
    value: number;
}

/**
 * DonutChart - A D3-based donut/pie chart component with React Legend
 * Maps to: Angular DonutComponent (donut.component.ts)
 *
 * @example
 * ```tsx
 * <DonutChart
 *   series={[
 *     { name: 'Category A', value: 30 },
 *     { name: 'Category B', value: 50 },
 *     { name: 'Category C', value: 20 },
 *   ]}
 *   center={{ title: 'Total', value: 100 }}
 *   legendPosition={LegendPosition.Right}
 *   onDataClick={(datum) => console.log('Clicked:', datum)}
 * />
 * ```
 */
export declare function DonutChart({ series, center, legendPosition, legendFontSize, formatLegendValue, applyDefaultSorting, displayLegendCounts, alignment, onDataClick, colorPalette, showTooltip, className, }: DonutChartProps): JSX_2.Element;

/**
 * Props for the DonutChart component
 * Maps to: Angular DonutComponent @Input (donut.component.ts)
 */
export declare interface DonutChartProps {
    /** Donut series data */
    series?: DonutSeries[];
    /** Center text configuration */
    center?: DonutCenter;
    /** Legend position (default: TopRight) */
    legendPosition?: LegendPosition;
    /** Legend font size */
    legendFontSize?: LegendFontSize;
    /** Whether to format legend values (default: true) */
    formatLegendValue?: boolean;
    /** Whether to apply default sorting by value (default: true) */
    applyDefaultSorting?: boolean;
    /** Whether to display legend counts (default: true) */
    displayLegendCounts?: boolean;
    /** Alignment of the donut chart (default: Center) */
    alignment?: DonutAlignmentStyle;
    /** Callback when a data slice is clicked */
    onDataClick?: (datum: DonutSeries) => void;
    /** Custom color palette */
    colorPalette?: string[];
    /** Whether to show tooltip on hover (default: true) */
    showTooltip?: boolean;
    /** Additional CSS class name for the container */
    className?: string;
}

/**
 * Donut chart configuration
 * Maps to: Angular DonutConfiguration (donut.ts lines 10-22)
 */
export declare interface DonutConfiguration {
    series: DonutSeries[];
    center?: DonutCenter;
    legendPosition?: LegendPosition;
    tooltipOption?: DonutTooltipOption<DonutSeries, unknown>;
    displayLegendCounts?: boolean;
    legendFontSize?: LegendFontSize;
    legendInteractionHandler?: LegendInteractionHandler;
    formatLegendValue?: boolean;
    eventHandlers?: {
        dataClicked?(datum: DonutSeries): void;
    };
}

/**
 * D3 selection type for the donut container element
 * Uses `unknown` for datum type to match Angular pattern and avoid D3 type conflicts
 */
declare type DonutContainerSelection = Selection_2<HTMLDivElement, unknown, null, undefined>;

/**
 * Data lookup strategy for donut charts
 * Maps to: Angular DonutDataLookupStrategy (donut-data-lookup-strategy.ts)
 *
 * Finds the donut slice at a given mouse location by calculating
 * the angle from the center and matching it to pie arc data.
 */
export declare class DonutDataLookupStrategy implements MouseDataLookupStrategy<Required<DonutSeries>, undefined> {
    private readonly pieData;
    private readonly invertedY;
    constructor(pieData: PieArcDatum<Required<DonutSeries>>[], invertedY?: boolean);
    dataForLocation(location: RelativeMouseLocation_2): MouseLocationData_2<Required<DonutSeries>, undefined>[];
    private findClosestSlice;
}

/**
 * Donut chart dimensions
 * Maps to: Angular DonutDimensions (donut-builder.service.ts lines 375-378)
 */
export declare interface DonutDimensions {
    visualizationWidth: number;
    visualizationHeight: number;
    legendWidth: number;
    legendHeight: number;
    donutOuterRadius: number;
    donutInnerRadius: number;
}

/**
 * DonutObject - wrapper for managing a rendered donut chart
 * Maps to: Angular Donut interface (donut.ts lines 4-8)
 *
 * Provides methods to reflow, redraw, or destroy the chart instance.
 * Similar pattern to RadarObject.
 */
export declare class DonutObject {
    private readonly containerSelection;
    private readonly config;
    private readonly donutBuilderService;
    private destroyed;
    constructor(containerSelection: DonutContainerSelection, config: InternalConfiguration, donutBuilderService: DonutBuilderService);
    /**
     * Destroys the chart and removes all elements.
     * After calling this, the object cannot be used for redraw.
     */
    destroy(): void;
    /**
     * Reflows the chart with updated dimensions.
     * Optionally accepts new configuration.
     */
    reflow(config?: DonutConfiguration): void;
    /**
     * Redraws the chart with new configuration.
     */
    redraw(config: DonutConfiguration): void;
    /**
     * Gets the current internal configuration
     */
    getConfig(): InternalConfiguration;
    private throwIfDestroyed;
}

/**
 * Donut results
 * Maps to: Angular DonutResults (donut.ts lines 41-44)
 */
export declare interface DonutResults {
    series: DonutSeries[];
    center?: DonutCenter;
}

/**
 * Donut series data
 * Maps to: Angular DonutSeries (donut.ts lines 29-34)
 */
export declare interface DonutSeries {
    name: string;
    color?: string;
    value: number;
    disabled?: boolean;
}

/**
 * Donut series with results
 * Maps to: Angular DonutSeriesResults (donut.ts lines 24-27)
 */
export declare interface DonutSeriesResults {
    series: DonutSeries[];
    total: number;
}

/**
 * DonutSkeleton - Loading skeleton for donut/pie chart widgets
 * Displays a segmented donut ring with shimmer animation,
 * optional title, legend bar, and loading text
 */
export declare const DonutSkeleton: default_2.FC<DonutSkeletonProps>;

export declare interface DonutSkeletonProps {
    /** Show/hide the top-left title skeleton box */
    showTitle?: boolean;
}

/**
 * Tooltip option for donut chart
 * Maps to: Angular TooltipOption (d3-visualization-builder.service.ts)
 */
export declare interface DonutTooltipOption<TData = unknown, TContext = unknown> {
    title: string;
    config?: ChartTooltipConfig<TData, TContext>;
}

/**
 * Configuration for LTTB downsampling of series data.
 */
declare interface DownsamplingConfig {
    /** Maximum number of data points per series before downsampling kicks in. */
    dataPointLimit: number;
}

/**
 * Dual Y-axis configuration
 */
export declare interface DualYAxisType {
    left: Axis;
    right: Axis;
}

export declare const durationFormatter: (duration?: number) => string;

/**
 * Parse duration from string (e.g., "5m", "1h", "30s")
 * Maps to: TimeDurationService.durationFromString() (lines 20-37)
 */
export declare function durationFromString(durationString: string): TimeDuration | undefined;

declare interface FilterAttribute<NameType = string> {
    name: NameType;
    displayName: string;
    units?: string;
    type: string;
    onlySupportsAggregation?: boolean;
    onlySupportsGrouping?: boolean;
    category?: string;
    unsupportedOperators?: string[];
    description?: string;
    /**
     * By default, the advanced filter support is disabled.
     * Using advanced filters will also require usage of `GraphQlFilterBuilderService`
     *  or a similar transformation for correct filter conversions.
     *
     * Operators: [Empty, NotEmpty]
     */
    supportAdvancedOperators?: boolean;
}

declare interface FilterAttributeExpression {
    attribute: FilterAttribute;
    subpath?: string;
}

export declare function FilterButton(props: FilterButtonProps): null;

/**
 * Filter button stub component
 * Maps to: Angular <ht-filter-button> (lines 78-84)
 *
 * Props match Angular @Input properties
 * TODO: Implement actual filter functionality
 */
export declare interface FilterButtonProps {
    attribute: FilterAttribute;
    metadata: FilterAttribute[];
    value: string;
    subpath?: string;
    className?: string;
}

export declare class FixedTimeRange implements TimeRange {
    readonly startTime: Date;
    readonly endTime: Date;
    static fromUrlString(urlString: string): undefined | FixedTimeRange;
    constructor(startTime: Date, endTime: Date);
    toUrlString(): string;
    toDisplayString(): string;
    isCustom(): boolean;
    toDurationMillis(): number;
}

export declare const floatFormatter: NumericFormatter;

export declare class ForceLayout implements TopologyLayout {
    layout(topology: RenderableTopology<TopologyNode, TopologyEdge>, width: number, height: number): void;
    private getProxyNodes;
    private getCollisionRadiusForNode;
    private getProxyEdges;
}

export declare const enum FormatterStyle {
    Float = "float",
    Integer = "int",
    Auto = "auto",
    None = "none"
}

/**
 * Format a numeric value based on the configured value type.
 *
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted string representation of the value
 */
export declare function formatValue(value: number | null | undefined, options?: ValueFormatOptions): string;

/**
 * A semi-circular gauge chart component.
 *
 * Displays a value as a filled arc against a background semicircle.
 * Supports threshold-based coloring and labels.
 */
export declare function GaugeChart({ value, maxValue, thresholds, defaultLabel, defaultColor, className, valueFormatOptions, variant, showArrow, enableTooltip, }: GaugeChartProps): default_2.ReactElement;

/**
 * Props for the GaugeChart component.
 */
export declare interface GaugeChartProps {
    /** Current value to display */
    value?: number;
    /** Maximum value (defines the full arc) */
    maxValue?: number;
    /** Thresholds for dynamic color and label changes */
    thresholds?: GaugeThreshold[];
    /** Default label when no threshold matches */
    defaultLabel?: string;
    /** Default color when no threshold matches */
    defaultColor?: string;
    /** Additional CSS class name */
    className?: string;
    /** Formatting options */
    valueFormatOptions?: ValueFormatOptions;
    /** Display variant - default fills from 0, segmented highlights threshold ranges */
    variant?: GaugeVariant;
    /** Show the arrow pointer */
    showArrow?: boolean;
    /** Enable tooltips on segment hover (only for segmented variant, default: true) */
    enableTooltip?: boolean;
}

/**
 * Threshold configuration for gauge color and label changes.
 * When the value falls within a threshold's range, its color and label are used.
 */
export declare interface GaugeThreshold {
    /** Label to display when value is within this threshold */
    label: string;
    /** Label to display in tooltip */
    tooltipLabel?: string;
    /** Start of the threshold range (inclusive) */
    start: number;
    /** End of the threshold range (inclusive) */
    end: number;
    /** Color to use when value is within this threshold */
    color: string;
}

/**
 * Data structure for gauge tooltip content
 */
export declare interface GaugeTooltipData {
    /** Threshold label (e.g., "Critical", "Warning", "Healthy") */
    label: string;
    /** Range start value */
    rangeStart: number;
    /** Range end value */
    rangeEnd: number;
    /** Segment color */
    color: string;
}

/**
 * Tooltip option for gauge chart
 */
export declare interface GaugeTooltipOption<TData = unknown, TContext = unknown> {
    title?: string;
    config?: ChartTooltipConfig<TData, TContext>;
}

/**
 * Display variant for the gauge chart.
 * - 'default': Fills from 0 to current value with a single arc
 * - 'segmented': Shows threshold segments, highlights only the active segment
 */
export declare type GaugeVariant = 'default' | 'segmented';

/**
 * Calculate auto duration from available time durations
 * This should match the logic from IntervalDurationService.getAutoDurationFromTimeDurations
 */
export declare function getAutoDurationFromTimeDurations(durations: TimeDuration[]): TimeDuration;

/**
 * Get display label for an interval value
 */
export declare function getIntervalLabel(interval: IntervalValue, availableIntervals: IntervalValue[]): string;

/**
 * Get height of a legend entry
 * Maps to: Angular private getLegendHeight() (lines 262-264)
 */
export declare function getLegendHeight(): number;

/**
 * Calculate width of a legend entry
 * Maps to: Angular private getLegendWidth() (lines 248-260)
 *
 * Uses 55% average character width approximation
 * Includes dot size, name width, value width, and spacing
 * Max width capped at 500px
 */
export declare function getLegendWidth(legend: LegendSeries<LegendDataValue>): number;

export declare const getStringsFromCommaSeparatedList: (text: string) => string[];

/**
 * Get duration of a time range
 * Maps to: TimeDurationService.getTimeRangeDuration() (lines 12-14)
 */
export declare function getTimeRangeDuration(timeRange: Pick<TimeRange, 'startTime' | 'endTime'>): TimeDuration;

/**
 * Get time range duration in milliseconds
 * Maps to: TimeDurationService.getTimeRangeDurationMillis() (lines 16-18)
 */
export declare function getTimeRangeDurationMillis(timeRange: Pick<TimeRange, 'startTime' | 'endTime'>): number;

/**
 * Get display label for a value type (for use in UI selectors).
 */
export declare function getValueTypeLabel(valueType: ValueType): string;

export declare class GraphLayout {
    protected levelToNodesMap: Map<number, RenderableTopologyNode[]>;
    protected readonly nodeToLevelMap: Map<RenderableTopologyNode, number>;
    private readonly layoutConfig;
    layout(topology: RenderableTopology<TopologyNode, TopologyEdge>): void;
    protected initialize(): void;
    protected findRootNodes(topology: RenderableTopology<TopologyNode, TopologyEdge>): void;
    protected fillNodeAndLevelMaps(): void;
    protected levelOrderTraversal(goingToBeExploredNodes: RenderableTopologyNode[], goingToBeOrAlreadyExploredNodes: Set<RenderableTopologyNode>): void;
    protected assignCoordinatesToNodes(): void;
    protected verticallyCenterAlignNodes(): void;
    protected getLayoutConfig(): TopologyGraphLayoutConfig;
}

export declare interface GroupingIntrospection {
    discriminatorOptions: string[];
    discriminatorValues: Record<string, string[]>;
    metadataKeys: string[];
    perTypeMetadataKeys: Record<string, string[]>;
}

export declare const hasBarSeries: (series?: Series<unknown>[]) => boolean;

export declare const integerFormatter: NumericFormatter;

/**
 * Internal configuration with required fields
 * Maps to: Angular InternalConfiguration (donut-builder.service.ts lines 362-373)
 */
export declare interface InternalConfiguration {
    series: Required<DonutSeries>[];
    center?: DonutCenter;
    legend: LegendPosition;
    tooltipOption?: DonutTooltipOption<DonutSeries, undefined>;
    displayLegendCounts: boolean;
    legendFontSize: LegendFontSize;
    legendInteractionHandler?: LegendInteractionHandler;
    formatLegendValue?: boolean;
    eventHandlers: {
        dataClicked?(datum: DonutSeries): void;
    };
}

declare interface InternalD3ZoomConfiguration<TContainer extends Element, TTarget extends Element> extends D3ZoomConfiguration<TContainer, TTarget> {
    brushOverlay?: Selection_2<SVGGElement, unknown, null, undefined>;
}

/**
 * Interval duration context value
 * Maps to: IntervalDurationService reactive state (line 26)
 */
export declare interface IntervalDurationContextValue {
    /** Available intervals for current time range (replaces availableIntervals$) */
    availableIntervals: TimeDuration[];
}

/**
 * Interval duration provider
 * Provides reactive available intervals based on current time range
 *
 * Maps to: IntervalDurationService constructor (lines 28-36)
 */
export declare function IntervalDurationProvider({ children, maximumDataPoints, }: {
    children: ReactNode;
    maximumDataPoints?: number;
}): JSX_2.Element;

export declare function IntervalSelect({ interval, intervalOptions, disabled, onChange, label, placeholder, }: IntervalSelectProps): JSX_2.Element;

export declare interface IntervalSelectProps {
    /** Current selected interval */
    interval?: IntervalValue;
    /** Available interval options */
    intervalOptions?: IntervalValue[];
    /** Whether the select is disabled */
    disabled?: boolean;
    /** Callback when interval changes */
    onChange?: (interval: IntervalValue) => void;
    /** Optional label for the select */
    label?: string;
    /** Optional placeholder text */
    placeholder?: string;
}

export declare type IntervalValue = TimeDuration | 'NONE' | 'AUTO';

export declare function introspectGroupingOptions<TNode extends TopologyNode>(nodes: TNode[], discriminator?: keyof TNode & string): GroupingIntrospection;

declare enum Key {
    Meta = "Meta",
    Control = "Control"
}

/**
 * Individual labeled value in tooltip
 * Maps to: DefaultChartTooltipLabeledValues (default-chart-tooltip.component.ts lines 175-182)
 */
export declare interface LabeledValue<TData = unknown, TContext = unknown> {
    /** Display label (e.g., series name) */
    label: string;
    /** Value to display */
    value: string | number | Date;
    /** Color for the indicator dot */
    color?: string;
    /** Units suffix (e.g., "ms", "MB") */
    units?: string;
    /** Original data point for drilldown */
    dataPoint?: TData;
    /** Context for drilldown (e.g., series) */
    context?: TContext;
}

export declare enum LabelOverflow {
    Wrap = "wrap",
    Rotate = "rotate",
    Truncate = "truncate"
}

declare enum LabelOverflow_2 {
    Wrap = "wrap",
    Rotate = "rotate"
}

/**
 * Legend component - displays chart legend with overflow handling
 * Maps to: Angular @Component LegendComponent (lines 23-266)
 */
export declare function Legend({ legendData, className }: LegendProps): JSX_2.Element;

export declare const LEGEND_DOT_SIZE = 16;

/**
 * Constants from Angular static properties (lines 119-124)
 */
export declare const LEGEND_HEIGHT = 14;

export declare const LEGEND_MAX_FONT_SIZE = 14;

export declare const LEGEND_PADDING = 8;

export declare const LEGEND_SPACING_HORIZONTAL = 32;

export declare const LEGEND_SPACING_VERTICAL = 16;

/**
 * Legend interaction callbacks
 */
export declare interface LegendCallbacks<TData> {
    onActiveSeriesChange?: (activeSeries: Series<TData>[]) => void;
}

/**
 * Legend click callback function
 * Maps to: Angular type LegendClickFn (line 320)
 */
export declare type LegendClickFn = (value: LegendSeries<LegendDataValue>) => void;

/**
 * Complete legend configuration
 * Maps to: Angular interface LegendData (lines 269-275)
 */
export declare interface LegendData<T extends LegendDataValue> {
    position: LegendPosition;
    layout: LegendLayout;
    fontSize: LegendFontSize;
    series: LegendSeries<T>[];
    interactionHandler?: LegendInteractionHandler;
}

/**
 * Legend data value interface
 * Maps to: Angular interface LegendDataValue (lines 285-288)
 */
export declare interface LegendDataValue {
    displayValue?: string;
    value?: any;
}

export declare function LegendEntry({ entry, fontSize, isClickable, isDisabled, onClick, }: LegendEntryProps): JSX_2.Element;

/**
 * Individual legend entry component
 * Maps to: Angular template lines 56-110 (legend-entry div)
 */
export declare interface LegendEntryProps {
    entry: LegendSeries<LegendDataValue>;
    fontSize: LegendFontSize;
    isClickable: boolean;
    isDisabled: boolean;
    onClick: (entry: LegendSeries<LegendDataValue>) => void;
}

/**
 * Legend filter information
 * Maps to: Angular interface LegendFilterInfo (lines 313-315)
 */
export declare interface LegendFilterInfo extends FilterAttributeExpression {
    allMetadata: FilterAttribute[];
}

/**
 * Legend font size options
 * Maps to: Angular enum LegendFontSize (lines 295-299)
 */
export declare enum LegendFontSize {
    ExtraSmall = "extra-small",
    Small = "small",
    Medium = "medium"
}

/**
 * Legend interaction handler
 * Maps to: Angular interface LegendInteractionHandler (lines 317-319)
 */
export declare interface LegendInteractionHandler {
    onClick?: LegendClickFn;
}

export declare function LegendItem({ bgColor, label, className, isDisabled, value, }: LegendItemProps): JSX_2.Element;

export declare interface LegendItemProps {
    bgColor: string;
    label: string;
    className?: string;
    isDisabled?: boolean;
    value?: string;
}

/**
 * Legend layout orientation
 * Maps to: Angular enum LegendLayout (lines 290-293)
 */
export declare enum LegendLayout {
    Row = "row",
    Column = "column"
}

/**
 * Legend position options
 * Maps to: Angular enum LegendPosition (lines 301-311)
 */
export declare enum LegendPosition {
    Bottom = "bottom",
    Right = "right",
    TopRight = "top-right",
    TopLeft = "top-left",
    Top = "top",
    Left = "left",
    Auto = "auto",
    None = "none"
}

/**
 * Legend component props
 * Replaces: Angular @Inject(LEGEND_DATA) (line 177)
 */
export declare interface LegendProps {
    /** Legend configuration and data */
    legendData: LegendData<LegendDataValue>;
    /** Optional className for container */
    className?: string;
}

/**
 * Individual legend series entry
 * Maps to: Angular interface LegendSeries (lines 277-283)
 */
export declare interface LegendSeries<T extends LegendDataValue> {
    name: string;
    color: string;
    disabled?: boolean;
    filterData?: LegendFilterInfo;
    data: T;
}

/**
 * LineSkeleton - Loading skeleton for line chart widgets
 * Displays smooth curved lines with shimmer animation,
 * horizontal dashed grid lines, optional title, legend bar, and loading text
 */
export declare const LineSkeleton: default_2.FC<LineSkeletonProps>;

export declare interface LineSkeletonProps {
    /** Show/hide the top-left title skeleton box */
    showTitle?: boolean;
}

/**
 * Logger service interface
 * Maps to: Angular LoggerService (lines 9-37)
 */
export declare interface Logger {
    /**
     * Log provided message at info level
     */
    info(...args: unknown[]): void;
    /**
     * Log provided message at debug level
     */
    debug(...args: unknown[]): void;
    /**
     * Log provided message at error level
     */
    error(...args: unknown[]): void;
    /**
     * Log provided message at warn level
     */
    warn(...args: unknown[]): void;
}

/**
 * Logger provider component
 * Wraps app to provide logger throughout component tree
 *
 * @example
 * <LoggerProvider>
 *   <App />
 * </LoggerProvider>
 */
export declare function LoggerProvider({ children, logger, }: {
    children: ReactNode;
    logger?: Logger;
}): JSX_2.Element;

declare interface MinMax {
    min: number;
    max: number;
}

declare interface MouseDataLookupStrategy<TData, TContext> {
    dataForLocation(location: RelativeMouseLocation_2): MouseLocationData_2<TData, TContext>[];
}

/**
 * Mouse location data
 * Maps to: Angular MouseLocationData (mouse-tracking.ts)
 */
export declare interface MouseLocationData<TData, TContext> {
    dataPoint: TData;
    context: TContext;
    location: RelativeMouseLocation_3;
}

declare interface MouseLocationData_2<TData, TContext> {
    dataPoint: TData;
    location: RelativeMouseLocation_2;
    context: TContext;
}

/**
 * Navigation service interface
 * Maps to: Angular NavigationService (lines 1-5)
 */
export declare interface Navigation {
    addQueryParametersToUrl(queryParams: QueryParamObject): void;
    /**
     * Navigate to a URL
     * @param url - URL to navigate to
     */
    navigate(url: string): void;
}

/**
 * Navigation provider component
 * Wraps app to provide navigation service throughout component tree
 *
 * @example
 * <NavigationProvider>
 *   <App />
 * </NavigationProvider>
 *
 * Or with custom navigation:
 * <NavigationProvider navigation={customNavigation}>
 *   <App />
 * </NavigationProvider>
 */
export declare function NavigationProvider({ children, navigation, }: {
    children: ReactNode;
    navigation?: Navigation;
}): JSX_2.Element;

export declare class NumericFormatter {
    static readonly STANDARD_VALUES: ReadonlyArray<NumericFormatterThreshold>;
    private static readonly DEFAULT_THRESHOLD;
    private static readonly DEFAULT_OPTIONS;
    protected readonly options: Readonly<Required<NumericFormatterOptions>>;
    constructor(options?: NumericFormatterOptions);
    format(value: number): string;
    protected applyOptionDefaults(options: NumericFormatterOptions): Readonly<Required<NumericFormatterOptions>>;
    protected findAppropriateThreshold(value: number): NumericFormatterThreshold;
    protected convertToScaledNumberForThreshold(value: number, threshold: NumericFormatterThreshold): number;
    protected convertNumberToString(value: number, threshold: NumericFormatterThreshold): string;
    protected getNumberOfDigitsForThreshold(threshold: NumericFormatterThreshold): number;
    protected roundToDecimalPlaces(value: number, decimalPlaces: number): number;
}

declare interface NumericFormatterOptions {
    trailingUnscaledDigits?: number;
    trailingScaledDigits?: number;
    trimTrailingZeros?: boolean;
    thresholds?: NumericFormatterThreshold[];
}

declare interface NumericFormatterThreshold {
    minimumValue: number;
    suffix: string;
    unitValue: number;
}

export declare class OrdinalFormatter {
    private static readonly ordinals;
    format(value: number): string;
}

declare type Params = {
    [key: string]: any;
};

/**
 * Options for parsing time range values.
 */
export declare interface ParseTimeRangeOptions {
    /**
     * If true, rounds relative time ranges to the nearest 5-minute window.
     * This is useful for caching purposes to prevent millisecond-level changes
     * from invalidating the cache.
     *
     * Only applies to relative time ranges (e.g., "7d", "1h").
     * Fixed time ranges are not affected as they are already stable.
     */
    stabilizeTimeRange?: boolean;
}

/**
 * Parses a time range value string and returns start and end times as ISO timestamps.
 *
 * Supports two formats:
 *
 * 1. **Relative time** - `<number><unit>` (e.g., "7d", "6M", "1h")
 *    Creates a time range from now going back by the specified duration.
 *    Units are case-sensitive and must match TimeUnit enum values:
 *    - `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours)
 *    - `d` (days), `w` (weeks), `M` (months - uppercase), `y` (years)
 *
 * 2. **Fixed time** - `<startEpochMs>-<endEpochMs>` (e.g., "1704067200000-1704153600000")
 *    Creates an exact time window using epoch milliseconds for start and end times.
 *    Useful when users select specific dates via a date time picker.
 *
 * @param value - The time range value string to parse
 * @param options - Optional parsing options
 * @param options.stabilizeTimeRange - If true, rounds relative time ranges to nearest 5-minute window for caching
 * @returns Object with startTime and endTime as epoch millisecond strings, or undefined if invalid
 *
 * @example
 * // Relative time - last 7 days
 * parseTimeRangeValue("7d")
 * // Returns: { startTime: "1704844800000", endTime: "1705449600000" }
 *
 * @example
 * // Fixed time - specific date range
 * parseTimeRangeValue("1704067200000-1704153600000")
 * // Returns: { startTime: "1704067200000", endTime: "1704153600000" }
 *
 * @example
 * // Stabilized relative time - rounds to nearest 5-minute window
 * parseTimeRangeValue("7d", { stabilizeTimeRange: true })
 * // Returns time range rounded to 5-minute boundaries for cache stability
 */
export declare function parseTimeRangeValue(value: string, options?: ParseTimeRangeOptions): {
    startTime: string;
    endTime: string;
} | undefined;

export declare interface PopoverEvent {
    type: PopoverEventType;
    data?: any;
}

/**
 * Event types for popover
 */
export declare type PopoverEventType = 'shown' | 'hidden' | 'closed' | 'hoverChange';

export declare interface PopoverFixedPosition {
    type: PopoverPositionType.Fixed;
    location: PopoverFixedPositionLocation;
    customLocation?: {
        x: number;
        y: number;
    };
}

/**
 * Fixed position locations
 * Maps to: PopoverFixedPositionLocation (lines 82-88)
 */
export declare enum PopoverFixedPositionLocation {
    BottomCenter = "bottom-center",
    Centered = "centered",
    Right = "right",
    Custom = "custom"
}

/**
 * Handle returned by usePopover hook
 * Provides imperative control over a popover
 */
export declare interface PopoverHandle {
    /** Show the popover with options */
    show(options: PopoverOptions): void;
    /** Hide the popover (can show again) */
    hide(): void;
    /** Close and cleanup the popover */
    close(): void;
    /** Current visibility - reads from provider state */
    readonly visible: boolean;
    /** Whether popover has been closed */
    readonly closed: boolean;
    /** Whether popover content is being hovered */
    isHovered(): boolean;
    /** Subscribe to popover mouse leave event */
    onMouseLeave(callback: () => void): () => void;
    /** Subscribe to events */
    on(event: 'shown' | 'hidden' | 'closed', callback: () => void): () => void;
    /** Close on escape key */
    closeOnEscapeKey(): () => void;
}

export declare interface PopoverHiddenPosition {
    type: PopoverPositionType.Hidden;
}

export declare const PopoverInternalContext: Context<PopoverInternalContextValue | undefined>;

/**
 * Internal context for popover state management
 * Used by usePopover hook
 */
declare interface PopoverInternalContextValue {
    showPopover: (id: string, options: PopoverOptions) => void;
    hidePopover: () => void;
    closePopover: () => void;
    isVisible: () => boolean;
    getActiveId: () => string | null;
    onPopoverMouseLeave: (callback: () => void) => () => void;
    isPopoverHovered: () => boolean;
    setPopoverHovered: (hovered: boolean) => void;
}

export declare interface PopoverMousePosition {
    type: PopoverPositionType.FollowMouse;
    boundingElement: Element;
    offsetX?: number;
    offsetY?: number;
}

/**
 * Popover options
 * Maps to: PopoverOptions (lines 4-10)
 */
export declare interface PopoverOptions<TData = any> {
    /** React component or render function */
    content: ComponentType<{
        data?: TData;
    }> | ((data?: TData) => ReactNode);
    /** Data to pass to content */
    data?: TData;
    /** Position configuration */
    position: PopoverPosition;
    /** Custom className for popover content */
    className?: string;
}

export declare type PopoverPosition = PopoverRelativePosition | PopoverFixedPosition | PopoverMousePosition | PopoverHiddenPosition;

/**
 * Position type enum
 * Maps to: PopoverPositionType (lines 61-67)
 */
export declare enum PopoverPositionType {
    Relative = "relative",
    Fixed = "fixed",
    FollowMouse = "follow-mouse",
    Hidden = "hidden"
}

/**
 * Reference to a popover instance
 * Maps to: Angular PopoverRef (lines 9-162)
 *
 * Provides methods to control popover and subscribe to events
 */
export declare class PopoverRef {
    id: string;
    private closeCallback;
    private _visible;
    private _closed;
    private eventListeners;
    private cleanupFunctions;
    constructor(id: string, closeCallback: () => void);
    /**
     * Check if popover is visible
     * Maps to: PopoverRef.visible getter (lines 20-22)
     */
    get visible(): boolean;
    /**
     * Check if popover is closed
     * Maps to: PopoverRef.closed getter (lines 16-18)
     */
    get closed(): boolean;
    /**
     * Show the popover
     * Maps to: PopoverRef.show() (lines 60-64)
     */
    show(): void;
    /**
     * Hide the popover (but don't destroy)
     * Maps to: PopoverRef.hide() (lines 54-58)
     */
    hide(): void;
    /**
     * Close and destroy the popover
     * Maps to: PopoverRef.close() (lines 66-71)
     */
    close(): void;
    /**
     * Subscribe to popover events
     * Replaces: RxJS observables (backdropClick$, shown$, hidden$, closed$)
     */
    on(eventType: string, callback: (event: any) => void): () => void;
    /**
     * Emit an event to all listeners
     */
    private emit;
    /**
     * Close on backdrop click
     * Maps to: PopoverRef.closeOnBackdropClick() (lines 98-103)
     */
    closeOnBackdropClick(): () => void;
    /**
     * Hide on backdrop click
     * Maps to: PopoverRef.hideOnBackdropClick() (lines 105-110)
     */
    hideOnBackdropClick(): () => void;
    /**
     * Close on escape key
     * Maps to: PopoverRef.closeOnEscapeKey() (lines 119-128)
     */
    closeOnEscapeKey(): () => void;
    /**
     * Close on viewport resize
     * Maps to: PopoverRef.closeOnViewportResize() (lines 136-142)
     */
    closeOnViewportResize(): () => void;
    /**
     * Trigger backdrop click event
     * Called internally by service
     */
    triggerBackdropClick(event: MouseEvent): void;
    /**
     * Cleanup all event listeners
     */
    private cleanup;
}

/**
 * Position configurations
 */
export declare interface PopoverRelativePosition {
    type: PopoverPositionType.Relative;
    anchorElement: HTMLElement | SVGElement;
    location: PopoverRelativePositionLocation;
    offsetX?: number;
    offsetY?: number;
}

/**
 * Relative position locations
 * Maps to: PopoverRelativePositionLocation (lines 69-80)
 */
export declare enum PopoverRelativePositionLocation {
    BelowCentered = "below-centered",
    BelowRightAligned = "below-right",
    BelowLeftAligned = "below-left",
    AboveCentered = "above-centered",
    AboveRightAligned = "above-right",
    AboveLeftAligned = "above-left",
    LeftCentered = "left-centered",
    RightCentered = "right-centered"
}

/**
 * Popover service provider
 * Manages single popover state (singleton - only one visible at a time)
 */
export declare function PopoverServiceProvider({ children }: {
    children: ReactNode;
}): JSX_2.Element;

export declare interface QueryParamObject extends Params {
    [key: string]: QueryParamValue;
}

export declare type QueryParamValue = string | string[] | boolean | boolean[] | number | number[] | undefined;

/**
 * Radar axis definition
 * Maps to: Angular RadarAxis (radar.ts lines 17-19)
 */
export declare interface RadarAxis {
    name: string;
}

/**
 * RadarChart - A D3-based radar/spider chart component with React Legend
 * Maps to: Angular RadarChartComponent (radar-chart.component.ts)
 *
 * @example
 * ```tsx
 * <RadarChart
 *   title="Performance Metrics"
 *   axes={[
 *     { name: 'Speed' },
 *     { name: 'Reliability' },
 *     { name: 'Comfort' },
 *     { name: 'Safety' },
 *     { name: 'Efficiency' }
 *   ]}
 *   series={[
 *     {
 *       name: 'Product A',
 *       color: '#ff6384',
 *       showPoints: true,
 *       data: [
 *         { axis: 'Speed', value: 80 },
 *         { axis: 'Reliability', value: 90 },
 *         { axis: 'Comfort', value: 70 },
 *         { axis: 'Safety', value: 85 },
 *         { axis: 'Efficiency', value: 75 }
 *       ]
 *     }
 *   ]}
 *   onPointClicked={(event) => console.log('Point clicked:', event)}
 * />
 * ```
 */
export declare function RadarChart({ title, axes, series, levels, legendPosition, showTooltip, onPointClicked, onSeriesClicked, className, }: RadarChartProps): JSX_2.Element;

/**
 * Props for the RadarChart component
 * Maps to: Angular RadarChartComponent @Input/@Output (radar-chart.component.ts)
 */
export declare interface RadarChartProps {
    /** Chart title */
    title?: string;
    /** Radar axes definitions */
    axes: RadarAxis[];
    /** Data series to display */
    series: RadarSeries[];
    /** Number of concentric grid levels (default: 10) */
    levels?: number;
    /** Height of the legend section in pixels */
    legendHeight?: number;
    /** Position of the legend (default: Bottom) */
    legendPosition?: LegendPosition;
    /** Whether to show tooltip on hover (default: true) */
    showTooltip?: boolean;
    /** Callback when a data point is clicked */
    onPointClicked?: (event: RadarPointEvent) => void;
    /** Callback when a series path/area is clicked */
    onSeriesClicked?: (seriesName: string) => void;
    /** Additional CSS class name for the container */
    className?: string;
}

/**
 * Margin configuration for chart sections
 * Maps to: Angular RadarMarginOption (radar.ts lines 41-46)
 */
export declare interface RadarMarginOption {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

/**
 * Full radar chart options
 * Maps to: Angular RadarOptions (radar.ts lines 27-39)
 */
export declare interface RadarOptions {
    title: string;
    axes: RadarAxis[];
    series: RadarSeries[];
    levels: number;
    chartMargin: RadarMarginOption;
    plotMargin: RadarMarginOption;
    tooltipOption: RadarTooltipOption;
    legendHeight: number;
    legendPosition: LegendPosition;
    onPointClicked(point: RadarPoint, seriesName: string): void;
    onSeriesClicked(seriesName: string): void;
}

/**
 * Individual data point on a radar axis
 * Maps to: Angular RadarPoint (radar.ts lines 12-15)
 */
export declare interface RadarPoint {
    axis: string;
    value: number;
}

/**
 * Event emitted when a point is clicked
 * Maps to: Angular RadarPointEvent (radar.ts lines 21-24)
 */
export declare interface RadarPointEvent {
    point: RadarPoint;
    seriesName: string;
}

/**
 * Radar series data
 * Maps to: Angular RadarSeries (radar.ts lines 5-10)
 */
export declare interface RadarSeries {
    name: string;
    data: RadarPoint[];
    color: string;
    showPoints: boolean;
}

/**
 * Tooltip visibility option
 * Maps to: Angular RadarTooltipOption (radar.ts lines 48-50)
 */
export declare interface RadarTooltipOption {
    visible: boolean;
}

/**
 * Type for relative mouse location
 */
export declare interface RelativeMouseLocation {
    x: number;
    y: number;
}

declare interface RelativeMouseLocation_2 {
    x: number;
    y: number;
}

/**
 * Relative mouse location
 */
declare interface RelativeMouseLocation_3 {
    x: number;
    y: number;
}

export declare class RelativeTimeRange implements TimeRange {
    readonly duration: Readonly<TimeDuration>;
    readonly startTime: Date;
    readonly endTime: Date;
    constructor(duration: Readonly<TimeDuration>);
    isCustom(): boolean;
    toUrlString(): string;
    toDisplayString(): string;
    toDurationMillis(): number;
}

export declare interface RenderableTopology<TNode extends TopologyNode, TEdge extends TopologyEdge> {
    nodes: RenderableTopologyNode<TNode>[];
    edges: RenderableTopologyEdge<TEdge>[];
    neighborhood: TopologyNeighborhood;
    demarcations?: RenderableTopologyDemarcation[];
}

export declare interface RenderableTopologyDemarcation {
    title: string;
    icon?: {
        svgPathData: string;
        tooltipValue?: string;
        onClick(): void;
    };
    horizontalDimension: {
        start: number;
        end: number;
    };
    verticalDimension: {
        start: number;
        end: number;
    };
    bordered?: boolean;
    backgroundColor?: string;
}

export declare interface RenderableTopologyEdge<TEdge extends TopologyEdge = TopologyEdge, TNode extends TopologyNode = TopologyNode> {
    source: RenderableTopologyNode<TNode>;
    target: RenderableTopologyNode<TNode>;
    state: TopologyEdgeState;
    userEdge: TEdge;
}

declare type RenderableTopologyElement = RenderableTopologyNode | RenderableTopologyEdge;

declare type RenderableTopologyElement_2 = RenderableTopologyNode | RenderableTopologyEdge;

export declare interface RenderableTopologyNode<TNode extends TopologyNode = TopologyNode> extends TopologyCoordinates {
    incoming: RenderableTopologyEdge[];
    outgoing: RenderableTopologyEdge[];
    state: TopologyNodeState;
    userNode: TNode;
    renderedData(): RenderableTopologyNodeRenderedData | undefined;
}

export declare interface RenderableTopologyNodeRenderedData {
    getAttachmentPoint(angleRad: number): TopologyCoordinates;
    getBoudingBox(): ClientRectBounds;
}

export declare enum RenderingStrategy {
    Svg = 0,
    Canvas = 1,
    Auto = 2
}

/**
 * Default debounce delay for resize observers in milliseconds.
 * This value is optimized to balance responsiveness with performance
 * by waiting for resize activity to settle before triggering redraws.
 */
export declare const RESIZE_DEBOUNCE_MS = 250;

/**
 * Resize entry with element dimensions
 */
export declare interface ResizeObserverDimensions {
    width: number;
    height: number;
}

export declare interface ScaleBounds {
    startY: number;
    endY: number;
    startX: number;
    endX: number;
}

export declare interface ScaleInitializationData<TData> {
    bounds: ScaleBounds;
    min?: number;
    max?: number;
    allSeriesAndBandSeries: Series<TData>[];
    seriesState?: SeriesState<TData>;
    dataAccessor<TDomain>(data: TData): TDomain;
}

export declare enum ScaleType {
    Linear = "linear",
    Log = "log",
    Time = "time",
    Band = "band"
}

/**
 * Internal interface for segment arc data (used in segmented variant).
 */
export declare interface SegmentArc {
    path: string;
    isActive: boolean;
    color: string;
    threshold: GaugeThreshold;
}

export declare interface SelectOption<T = string> {
    label: string;
    value: T;
    disabled?: boolean;
}

/**
 * Framework-agnostic DOM utilities
 * Replaces Angular-specific imports from projects/common
 */
/**
 * Creates a CSS selector string from a class name
 * @param className - The CSS class name
 * @returns A CSS selector string (e.g., ".my-class")
 */
export declare function selector(className: string): string;

export declare interface Series<TInterval> {
    data: TInterval[];
    units?: string;
    summary?: Summary;
    color: string;
    name: string;
    displayName?: string;
    groupName?: string;
    disabled?: boolean;
    symbol?: {
        type?: SeriesSymbol;
        show?(datum: TInterval): boolean;
        getColor?(datum: TInterval): string;
    };
    type: CartesianSeriesVisualizationType;
    groupBy?: SeriesGroupBy;
    stacking?: boolean;
    hide?: boolean;
    hideTooltip?: boolean;
    yAxisName?: string;
    legendColor?: string;
    getColor?(datum?: TInterval): string;
    getTooltipTitle?(datum: TInterval): string;
    verticalLine?: {
        show?(datum: TInterval): boolean;
        getColor?(datum: TInterval): string;
    };
}

declare interface SeriesGroupBy {
    attribute?: string;
}

declare interface SeriesState<TData> {
    getBaseline(datum: TData): number | undefined;
    getMaxValue(): number;
}

declare enum SeriesSymbol {
    Circle = 0,
    Square = 1,
    Triangle = 2,
    Cross = 3
}

export declare type ShadowSize = 'sm' | 'md' | 'lg';

export declare interface Summary {
    value: number;
    units?: string;
}

declare type SupportedNamespace = 'svg' | 'xhtml';

declare class SvgUtilService {
    private readonly domElementMeasurerService;
    private readonly d3UtilService;
    private static readonly DEFAULT_DROPSHADOWS;
    constructor(domElementMeasurerService: DomElementMeasurerService, d3UtilService: D3UtilService);
    addDefinitionDeclarationToSvgIfNotExists(element: SVGGraphicsElement): SVGDefsElement;
    addDropshadowFilterToParentSvgIfNotExists(element: SVGGraphicsElement, filterId: string, color?: string): SVGFilterElement;
    getParentSvgElement(element: SVGGraphicsElement): SVGSVGElement;
    getElementTextLength(element: SVGTextElement): number;
    truncateText(element: SVGTextElement, width: number): void;
    /**
     * Wraps text in the given text element so that it doesn't exceed the specified width.
     * If a single word can't fit in the given width then it is truncated.
     *
     * @param element The original SVG Text element that needs to be wrapped
     * @param width The final width of the wrapped text
     * @param truncateText If true, the text will be truncated if it doesn't fit in the given width
     * @param maxLines Optional maximum number of lines to wrap to (undefined = unlimited)
     * @return Object with truncated flag and original text for tooltip
     */
    wrapTextIfNeeded(element: SVGTextElement, width: number, truncateText?: boolean, maxLines?: number): {
        truncated: boolean;
        originalText: string;
    };
    unWrapText(element: SVGTextElement): void;
}

/**
 * Constants
 * Maps to: TimeRangeService static properties (lines 33-36)
 */
export declare const TIME_RANGE_QUERY_PARAM = "time";

export declare class TimeDuration {
    readonly value: number;
    readonly unit: TimeUnit;
    private static readonly TIME_UNITS;
    private readonly millis;
    constructor(value: number, unit: TimeUnit);
    toMillis(): number;
    static parse(durationString: string): TimeDuration;
    getAmountForUnit(unit: ConvertibleTimeUnit): number;
    static reduce(durations: TimeDuration[]): TimeDuration;
    toIso8601DurationString(): string;
    toMultiUnitDurations(smallestUnit?: ConvertibleTimeUnit, maxSupportedUnit?: TimeUnit, displayZero?: boolean): TimeDuration[];
    toMultiUnitString(smallestUnit?: ConvertibleTimeUnit, displayZero?: boolean, unitStringType?: UnitStringType): string;
    toFormattedString(unitStringType?: UnitStringType): string;
    getMostSignificantUnitOnly(maxSupportedUnit?: TimeUnit): TimeDuration;
    /**
     * Returns the most significant whole unit of the duration.
     * Eg:
     * - `PT1H40M` -> `PT100M`
     * - `P1W2D` -> `P9D`
     * - `P1W2DT2H` -> `P218H`
     *
     * @param minSupportedUnit
     * @param maxSupportedUnit
     */
    getMostSignificantWholeUnitOnly(minSupportedUnit?: TimeUnit, maxSupportedUnit?: TimeUnit): TimeDuration;
    toString(): string;
    toRelativeString(): string;
    toLongString(): string;
    isEqualDuration(other: TimeDuration): boolean;
    isEquivalentDuration(other: TimeDuration): boolean;
    isGreaterDuration(other: TimeDuration): boolean;
    isLesserDuration(other: TimeDuration): boolean;
    private normalizeToMillis;
    private toUnitString;
    private unitInMillis;
}

export declare interface TimeRange {
    readonly startTime: Date;
    readonly endTime: Date;
    toUrlString(): string;
    toDisplayString(): string;
    isCustom(): boolean;
    toDurationMillis(): number;
}

/**
 * Time range context value
 * Maps to: TimeRangeService public API
 */
export declare interface TimeRangeContextValue {
    /** Current time range (replaces timeRangeSubject$) */
    timeRange: TimeRange;
    /** Set relative time range */
    setRelativeRange: (value: number, unit: TimeUnit) => void;
    /** Set fixed time range */
    setFixedRange: (startTime: Date, endTime: Date) => void;
    /** Refresh current time range */
    refresh: () => void;
    /** Parse time range from URL string */
    timeRangeFromUrlString: (timeRangeString: string, maxDuration?: TimeDuration) => TimeRange;
    /** Convert time range to query params */
    toQueryParams: (timeRange: TimeRange) => Record<string, string>;
}

/**
 * Time range provider
 * Manages global time range state
 *
 * Maps to: TimeRangeService (lines 32-208)
 */
export declare function TimeRangeProvider({ children, initialTimeRange, }: {
    children: ReactNode;
    initialTimeRange?: TimeRange;
}): JSX_2.Element;

export declare const enum TimeUnit {
    Millisecond = "ms",
    Second = "s",
    Minute = "m",
    Hour = "h",
    Day = "d",
    Week = "w",
    Month = "M",
    Year = "y"
}

export declare function toFixedTimeRange(startTime: Date, endTime: Date): FixedTimeRange;

/**
 * Tooltip display callback
 */
export declare interface TooltipDisplayCallback<TData> {
    show: (containerElement: SVGSVGElement, data: MouseLocationData_2<TData, Series<TData> | Band<TData>>[], location: RelativeMouseLocation_2, event: MouseEvent) => void;
    hide: () => void;
}

/**
 * Tooltip group
 * Maps to: DefaultChartTooltipGroup (default-chart-tooltip.component.ts lines 170-173)
 */
export declare interface TooltipGroup<TData = unknown, TContext = unknown> {
    /** Optional group title */
    title?: string;
    /** Labeled values in this group */
    labeledValues: LabeledValue<TData, TContext>[];
}

export declare function TopologyChart<TNode extends TopologyNode = TopologyNode>({ nodes, nodeRenderer, edgeRenderer, layoutType, customLayout, nodeDataSpecifiers, edgeDataSpecifiers, tooltipComponent, nodeInteractionHandler, edgeInteractionHandler, draggableNodes, hoverableNodes, hoverableEdges, clickableNodes, clickableEdges, showBrush: showBrushProp, shouldAutoZoomToFit: shouldAutoZoomToFitProp, supportGroupNode, enableDemarcation, zoomable: zoomableProp, autoGroup, }: TopologyChartProps<TNode>): default_2.ReactElement | null;

export declare interface TopologyChartProps<TNode extends TopologyNode = TopologyNode> {
    nodes: TNode[];
    nodeRenderer: TopologyNodeRenderer;
    edgeRenderer: TopologyEdgeRenderer;
    layoutType?: TopologyLayoutType;
    customLayout?: TopologyLayout;
    nodeDataSpecifiers?: TopologyDataSpecifier[];
    edgeDataSpecifiers?: TopologyDataSpecifier[];
    tooltipComponent?: ComponentType<{
        data: TopologyTooltipData;
        onClose: () => void;
    }>;
    nodeInteractionHandler?: TopologyNodeInteractionHandler;
    edgeInteractionHandler?: TopologyEdgeInteractionHandler;
    draggableNodes?: boolean;
    hoverableNodes?: boolean;
    hoverableEdges?: boolean;
    clickableNodes?: boolean;
    clickableEdges?: boolean;
    showBrush?: boolean;
    shouldAutoZoomToFit?: boolean;
    supportGroupNode?: boolean;
    enableDemarcation?: boolean;
    zoomable?: boolean;
    autoGroup?: AutoGroupConfig<TNode>;
}

declare class TopologyClick extends TopologyEventBehavior {
    constructor(d3Utils: D3UtilService);
    addNodeClickBehavior(nodes: RenderableTopologyNode[], nodeRenderer: TopologyNodeRenderer): Observable<RenderableTopologyNode>;
    addEdgeClickBehavior(edges: RenderableTopologyEdge[], edgeRenderer: TopologyEdgeRenderer): Observable<RenderableTopologyEdge>;
    private onNodeClick;
    private onEdgeClick;
}

export declare interface TopologyConfiguration {
    draggableNodes: boolean;
    hoverableNodes: boolean;
    hoverableEdges: boolean;
    clickableNodes: boolean;
    clickableEdges: boolean;
    zoomable: boolean;
    showBrush?: boolean;
    shouldAutoZoomToFit?: boolean;
    nodeDataSpecifiers: TopologyDataSpecifier[];
    edgeDataSpecifiers: TopologyDataSpecifier[];
    nodes: TopologyNode[];
    nodeRenderer: TopologyNodeRenderer;
    edgeRenderer: TopologyEdgeRenderer;
    tooltipCallbacks?: TopologyTooltipCallbacks;
    nodeInteractionHandler?: TopologyNodeInteractionHandler;
    edgeInteractionHandler?: TopologyEdgeInteractionHandler;
    layoutType?: TopologyLayoutType;
    customLayout?: TopologyLayout;
    supportGroupNode?: boolean;
    enableDemarcation?: boolean;
    autoGroupDiscriminator?: string;
}

export declare class TopologyConverter {
    convertTopology(nodes: TopologyNode[], stateManager: TopologyStateManager, nodeRenderer: TopologyNodeRenderer, oldTopology?: RenderableTopology<TopologyNode, TopologyEdge>, supportGroupNode?: boolean): RenderableTopology<TopologyNode, TopologyEdge>;
    private buildRenderableNodeMap;
    private findUniqueEdges;
    private convertEdgesToRenderableEdges;
    private handleEdgeFilteringBasedOnGroupNode;
    private buildNewTopologyNode;
    private buildNewTopologyEdge;
}

export declare interface TopologyCoordinates {
    x: number;
    y: number;
}

export declare interface TopologyDataSpecifier<T = unknown> {
    label: string;
    value: T;
}

export declare class TopologyDemarcationRenderer {
    private readonly svgUtils;
    private readonly className;
    private readonly classIcon;
    constructor(svgUtils: SvgUtilService);
    draw(container: SVGGElement, demarcations: RenderableTopologyDemarcation[]): void;
    private getLinePositionsForDemarcation;
    private getLinePathString;
}

declare interface TopologyDragEvent {
    node: RenderableTopologyNode;
    type: 'start' | 'drag' | 'end';
}

export declare interface TopologyEdge {
    fromNode: TopologyNode;
    toNode: TopologyNode;
}

export declare type TopologyEdgeInteractionHandler = TopologyInteractionHandler<TopologyEdge>;

export declare interface TopologyEdgePositionInformation {
    source: {
        x: number;
        y: number;
    };
    target: {
        x: number;
        y: number;
    };
    sourceRad: number;
    targetRad: number;
}

export declare interface TopologyEdgeRenderDelegate<T extends TopologyEdge = TopologyEdge> {
    matches(edge: TopologyEdge): edge is T;
    draw(parentElement: SVGGElement, edge: T, position: TopologyEdgePositionInformation, state: TopologyEdgeState): void;
    updatePosition(parentElement: SVGGElement, edge: T, position: TopologyEdgePositionInformation): void;
    updateState(parentElement: SVGGElement, edge: T, state: TopologyEdgeState, position?: TopologyEdgePositionInformation): void;
}

export declare interface TopologyEdgeRenderer {
    drawEdge(parentElement: SVGSVGElement | SVGGElement, edge: RenderableTopologyEdge): void;
    updateEdgePosition(edge: RenderableTopologyEdge): void;
    updateEdgeState(edge: RenderableTopologyEdge): void;
    getElementForEdge(edge: RenderableTopologyEdge): Element | undefined;
    destroyEdge(edge: RenderableTopologyEdge): void;
}

export declare class TopologyEdgeRendererService implements TopologyEdgeRenderer {
    private readonly rendererDelegates;
    private readonly rendererEdgeMap;
    private readonly d3Utils;
    withDelegate(delegate: TopologyEdgeRenderDelegate): this;
    drawEdge(parentElement: Element, edge: RenderableTopologyEdge): void;
    updateEdgePosition(edge: RenderableTopologyEdge): void;
    updateEdgeState(edge: RenderableTopologyEdge): void;
    destroyEdge(edge: RenderableTopologyEdge): void;
    getElementForEdge(edge: RenderableTopologyEdge): Element | undefined;
    private createEdgeContainer;
    private buildEdgePosition;
    private getMatchingDelegate;
}

export declare type TopologyEdgeState<TDataSpec = unknown> = DeepReadonly<TopologyElementState<TDataSpec>>;

declare interface TopologyEdgeUpdate {
    edges: TopologyEdge[];
    update: Partial<TopologyUniqueState<TopologyEdgeState>>;
}

declare interface TopologyElementState<TDataSpec> {
    visibility: TopologyElementVisibility;
    selectedDataSpecifier?: TopologyDataSpecifier<TDataSpec>;
    dataSpecifiers?: TopologyDataSpecifier<TDataSpec>[];
}

export declare const enum TopologyElementVisibility {
    Normal = "normal",
    Emphasized = "emphasized",
    Focused = "focused",
    Background = "background",
    Hidden = "hidden"
}

declare abstract class TopologyEventBehavior {
    protected readonly d3Utils: D3UtilService;
    protected readonly eventScope?: string | undefined;
    constructor(d3Utils: D3UtilService, eventScope?: string | undefined);
    protected buildLookupMap<T extends RenderableTopologyElement>(renderableElements: T[], elementLookupFn: (renderableElements: T) => Element | undefined): Map<Element, T>;
    protected buildObservableForEvents<TTopologyElement extends RenderableTopologyElement, TEvent>(topologyElements: TTopologyElement[], elementLookupFn: (topologyElement: TTopologyElement) => Element | undefined, ...eventAndCallbacks: {
        eventName: string;
        callback(element: TTopologyElement, eventObserver: Observer<TEvent>): void;
    }[]): Observable<TEvent>;
    protected scopeEventName(eventName: string): string;
}

export declare interface TopologyGraphLayoutConfig {
    horizontalNodeGap: number;
    verticalNodeGap: number;
    startX: number;
    startY: number;
    defaultNodeWidth: number;
    defaultNodeHeight: number;
}

export declare interface TopologyGroupNode<TData = TopologyGroupNodeData> {
    nodeType: TopologyInternalNodeType.GroupNode;
    edges: TopologyEdge[];
    expanded: boolean;
    data: TData;
    children: TopologyNode[];
}

export declare interface TopologyGroupNodeData {
    title: string;
    suffixIcon?: string;
}

export declare abstract class TopologyGroupNodeUtil {
    static isTopologyGroupNode<TData = TopologyGroupNodeData>(node: TopologyNode): node is TopologyGroupNode<TData>;
    static getUpdatedNodesOnGroupNodeClick(userNode: TopologyGroupNode, userNodes: TopologyNode[]): TopologyNode[];
    static updateLayoutForGroupNode(topology: RenderableTopology<TopologyNode, TopologyEdge>, groupNode: TopologyGroupNode): void;
    static updateLayoutOnGroupNodeDrag(dragEvent: TopologyDragEvent, topologyData: RenderableTopology<TopologyNode, TopologyEdge>): void;
    static collapseGroupNodes(userNodes: TopologyNode[]): TopologyNode[];
}

declare class TopologyHover extends TopologyEventBehavior {
    private static readonly DEFAULT_HOVER_OPTIONS;
    constructor(d3Utils: D3UtilService);
    private readonly delayMap;
    addNodeHoverBehavior(nodes: RenderableTopologyNode[], nodeRenderer: TopologyNodeRenderer, options?: TopologyHoverOptions): Observable<TopologyHoverEvent<RenderableTopologyNode>>;
    addEdgeHoverBehavior(edges: RenderableTopologyEdge[], edgeRenderer: TopologyEdgeRenderer, options?: TopologyHoverOptions): Observable<TopologyHoverEvent<RenderableTopologyEdge>>;
    private buildObservableForHover;
    private buildDefaultedOptions;
    private onMouseEnter;
    private onHoverEnd;
    private fireStartEventAndUpdateState;
    private fireEndEvent;
    private clearAnyPendingState;
}

declare interface TopologyHoverEvent<T extends RenderableTopologyElement_2> {
    source: T;
    event: 'start' | 'end';
}

declare interface TopologyHoverOptions {
    delayMillis?: number;
    endHoverEvents?: string[];
}

export declare const TopologyInteractionControl: default_2.NamedExoticComponent<TopologyInteractionControlProps>;

export declare interface TopologyInteractionControlProps {
    stateManager: TopologyStateManager | null;
    zoom: TopologyZoom<SVGSVGElement, SVGGElement> | null;
    currentTopology: (() => RenderableTopology<TopologyNode, TopologyEdge>) | null;
    onRelayout: (() => void) | null;
    enableDemarcation?: boolean;
    zoomable?: boolean;
    nodeDataSpecifiers?: TopologyDataSpecifier[];
    edgeDataSpecifiers?: TopologyDataSpecifier[];
    settingsSlot?: default_2.ReactNode;
}

export declare interface TopologyInteractionHandler<T = unknown> {
    click?(data: T): Observable<true>;
    disableTooltipOnHover?: boolean;
}

export declare interface TopologyInterface {
    draw(): this;
    destroy(): void;
}

export declare const enum TopologyInternalNodeType {
    GroupNode = "group-node"
}

export declare interface TopologyLayout {
    layout(topology: RenderableTopology<TopologyNode, TopologyEdge>, width: number, height: number): void;
}

export declare const enum TopologyLayoutType {
    ForceLayout = "force-layout",
    TreeLayout = "tree-layout",
    CustomTreeLayout = "custom-tree-layout",
    GraphLayout = "graph-layout",
    VerticalGraphLayout = "vertical-graph-layout"
}

export declare interface TopologyNeighborhood {
    nodes: TopologyNode[];
    edges: TopologyEdge[];
}

export declare class TopologyNeighborhoodFinder {
    neighborhoodForNode(node: TopologyNode): TopologyNeighborhood;
    neighborhoodForEdge(edge: TopologyEdge): TopologyNeighborhood;
    singleNodeNeighborhood(node: TopologyNode): TopologyNeighborhood;
    emptyNeighborhood(): TopologyNeighborhood;
}

declare interface TopologyNeighborhoodUpdate {
    neighborhood: TopologyNeighborhood;
    update: Partial<TopologyUniqueState<TopologyNodeState & TopologyEdgeState>>;
}

export declare interface TopologyNode {
    edges: TopologyEdge[];
    metadata?: Record<string, string | number | boolean>;
}

declare class TopologyNodeDrag extends TopologyEventBehavior {
    addDragBehavior(topologyData: RenderableTopology<TopologyNode, TopologyEdge>, nodeRenderer: TopologyNodeRenderer, supportGroupNode: boolean): Observable<TopologyDragEvent>;
    getDragEventName(): string;
}

export declare type TopologyNodeInteractionHandler = TopologyInteractionHandler<TopologyNode>;

export declare interface TopologyNodeRenderer {
    drawNode(parentElement: SVGSVGElement | SVGGElement, node: RenderableTopologyNode): void;
    getRenderedNodeData(node: RenderableTopologyNode): RenderableTopologyNodeRenderedData | undefined;
    updateNodePosition(node: RenderableTopologyNode): void;
    updateNodeState(node: RenderableTopologyNode): void;
    getElementForNode(node: RenderableTopologyNode): Element | undefined;
    destroyNode(node: RenderableTopologyNode): void;
}

export declare interface TopologyNodeRendererDelegate<T extends TopologyNode = TopologyNode> {
    matches(node: TopologyNode): node is T;
    draw(parentElement: SVGGElement, node: T, state: TopologyNodeState): void;
    destroy?(node: T): void;
    updateState(parentElement: SVGGElement, node: T, state: TopologyNodeState): void;
    height(node: T): number;
    width(node: T): number;
    getAttachmentPoint(angleRad: number, node: T): TopologyCoordinates;
}

export declare class TopologyNodeRendererService implements TopologyNodeRenderer {
    private readonly rendererDelegates;
    private readonly renderedNodeMap;
    private readonly d3Utils;
    withDelegate(delegate: TopologyNodeRendererDelegate): this;
    drawNode(parentElement: SVGSVGElement | SVGGElement, node: RenderableTopologyNode): void;
    getRenderedNodeData(node: RenderableTopologyNode): RenderableTopologyNodeRenderedData | undefined;
    updateNodePosition(node: RenderableTopologyNode): void;
    updateNodeState(node: RenderableTopologyNode): void;
    getElementForNode(node: RenderableTopologyNode): Element | undefined;
    destroyNode(node: RenderableTopologyNode): void;
    private createNodeContainer;
    private getBoundedX;
    private getBoundedY;
    private mapNodeCoordinatesToTopologyCoordinates;
    private getMatchingDelegate;
    private getBoundingBox;
}

export declare type TopologyNodeState<TDataSpec = unknown> = DeepReadonly<TopologyElementState<TDataSpec> & {
    dragging: boolean;
}>;

declare interface TopologyNodeUpdate {
    nodes: TopologyNode[];
    update: Partial<TopologyUniqueState<TopologyNodeState>>;
}

export declare class TopologyStateManager {
    private readonly config;
    private readonly stateChangeSubject;
    readonly stateChange$: Observable<void>;
    private readonly currentStateByNode;
    private readonly currentStateByEdge;
    private currentSelectedNodeSpecifier?;
    private currentSelectedEdgeSpecifier?;
    constructor(config: TopologyConfiguration);
    getNodeState(node: TopologyNode): TopologyNodeState;
    getEdgeState(edge: TopologyEdge): TopologyEdgeState;
    updateState(...stateUpdates: TopologyStateUpdate[]): void;
    getSelectedNodeDataSpecifier(): TopologyDataSpecifier | undefined;
    setSelectedNodeDataSpecifier(value: TopologyDataSpecifier | undefined): void;
    getSelectedEdgeDataSpecifier(): TopologyDataSpecifier | undefined;
    setSelectedEdgeDataSpecifier(value: TopologyDataSpecifier | undefined): void;
    private buildInitialNodeState;
    private buildInitialEdgeState;
    private getNodeUniqueState;
    private getEdgeUniqueState;
    private applyStateUpdate;
    private applyNodeUpdate;
    private applyEdgeUpdate;
    private isNeighborhoodUpdate;
    private isNodeUpdate;
    private isEdgeUpdate;
}

export declare type TopologyStateUpdate = TopologyNeighborhoodUpdate | TopologyNodeUpdate | TopologyEdgeUpdate;

export declare interface TopologyTooltipCallbacks {
    showNodeTooltip(node: TopologyNode, anchorElement: Element, modal: boolean): void;
    showEdgeTooltip(edge: TopologyEdge, anchorElement: Element, modal: boolean): void;
    hide(): void;
    onHidden(callback: () => void): void;
}

export declare interface TopologyTooltipData {
    type: 'node' | 'edge';
    node?: TopologyNode;
    edge?: TopologyEdge;
}

declare type TopologyUniqueState<T extends TopologyEdgeState | TopologyNodeState> = Omit<T, 'dataSpecifier'>;

export declare class TopologyZoom<TContainer extends Element = Element, TTarget extends Element = Element> extends D3Zoom<TContainer, TTarget> {
    zoomToFit(nodes: RenderableTopologyNode[], offset?: number): void;
    panToTopLeft(nodes: RenderableTopologyNode[], offset?: number): void;
    private determineZoomScale;
    updateBrushOverlayWithData(nodes: RenderableTopologyNode[]): void;
    private offsetAndGetClientRect;
}

/**
 * Static helper functions
 * Maps to: TimeRangeService static methods (lines 187-193)
 */
export declare function toRelativeTimeRange(value: number, unit: TimeUnit): RelativeTimeRange;

export declare class TreeLayout implements TopologyLayout {
    layout(topology: RenderableTopology<TopologyNode, TopologyEdge>): void;
    private updatePositions;
    private getMinYPosition;
    protected buildHierarchyProxyNodes(nodes: RenderableTopologyNode[], startingLocation: TopologyCoordinates): D3ProxyNode;
    protected getNodeWidth(root: HierarchyNode<D3ProxyNode>): number;
    protected getNodeHeight(root: HierarchyNode<D3ProxyNode>): number;
    private getRenderedNodeHeight;
    protected buildTopologyHierarchyNodeMap(nodes: RenderableTopologyNode[], startingLocation: TopologyCoordinates): Map<RenderableTopologyNode, D3ProxyNode>;
    private nodeIntroducesCycle;
    private removeSelfLinks;
}

export declare enum UnitStringType {
    Long = "long",
    Short = "short"
}

/**
 * React Hook for Chart Synchronization
 *
 * Usage example:
 * ```tsx
 * import { useChartSync } from '@harness/dashboard-visualization';
 *
 * function MyChart({ groupId }) {
 *   const { onMouseMove, onMouseLeave } = useChartSync(
 *     'chart-1',
 *     groupId,
 *     showCrosshair,
 *     hideCrosshair
 *   );
 *   // ... use in event handlers
 * }
 * ```
 */
export declare function useChartSync(chartId: string, groupId: string | undefined, showCrosshair: (event: MouseEvent, x: number, y: number, data?: any[]) => void, hideCrosshair: () => void): {
    onMouseMove: (event: MouseEvent, x: number, y: number, data?: any[]) => void;
    onMouseLeave: () => void;
};

/**
 * Hook for chart tooltips
 * Replaces ChartTooltipPopover class
 *
 * @example
 * function RadarChart() {
 *   const tooltipRef = useChartTooltip(
 *     RadarChartTooltipService.convertToDefaultTooltipRenderData,
 *     DefaultChartTooltip
 *   );
 *
 *   // Pass tooltipRef to D3 service
 *   useEffect(() => {
 *     chartService.getTooltipService().setTooltipRef(tooltipRef);
 *   }, [tooltipRef]);
 *
 *   return <div ref={containerRef} />;
 * }
 */
export declare function useChartTooltip<TData, TContext, TRenderData = DefaultChartTooltipRenderData<TData, TContext>>(mapper?: ChartTooltipDataMapper<TData, TContext, TRenderData>, Component?: ComponentType<{
    data: TRenderData;
    onClose: () => void;
}>): ChartTooltipRef<TData, TContext>;

/**
 * Custom hook for managing donut chart lifecycle
 * Maps to: Angular DonutComponent logic (donut.component.ts)
 *
 * @example
 * ```tsx
 * function MyDonutChart() {
 *   const { containerRef } = useDonutChart({
 *     series: [
 *       { name: 'Category A', value: 30 },
 *       { name: 'Category B', value: 70 },
 *     ],
 *     center: { title: 'Total', value: 100 },
 *     showTooltip: true,
 *   });
 *
 *   return <div ref={containerRef} style={{ width: 300, height: 300 }} />;
 * }
 * ```
 */
export declare function useDonutChart(options: UseDonutChartOptions): UseDonutChartReturn;

/**
 * Options for the useDonutChart hook
 */
export declare interface UseDonutChartOptions {
    /** Donut series data */
    series?: DonutSeries[];
    /** Center text configuration */
    center?: DonutCenter;
    /** Legend position (passed to D3 service, but typically None since React handles legend) */
    legendPosition?: LegendPosition;
    /** Legend font size */
    legendFontSize?: LegendFontSize;
    /** Whether to format legend values */
    formatLegendValue?: boolean;
    /** Whether to display legend counts */
    displayLegendCounts?: boolean;
    /** Callback when a data slice is clicked */
    onDataClick?: (datum: DonutSeries) => void;
    /** Whether to show tooltip on hover (default: true) */
    showTooltip?: boolean;
}

/**
 * Return type for the useDonutChart hook
 */
export declare interface UseDonutChartReturn {
    /** Ref to attach to the container element */
    containerRef: React.RefObject<HTMLDivElement>;
    /** Force a chart rebuild */
    rebuild: () => void;
}

/**
 * Hook to access interval duration context
 *
 * @example
 * function MyComponent() {
 *   const { availableIntervals } = useIntervalDuration();
 *   // Use availableIntervals array
 * }
 */
export declare function useIntervalDuration(): IntervalDurationContextValue;

/**
 * Hook to access logger service
 * Replaces: Angular constructor(private logger: LoggerService)
 *
 * @example
 * function MyComponent() {
 *   const logger = useLogger();
 *   logger.info('Component mounted');
 * }
 */
export declare function useLogger(): Logger;

/**
 * Hook to access navigation service
 * Replaces: Angular constructor(private navigationService: NavigationService)
 *
 * @example
 * function MyComponent() {
 *   const navigation = useNavigation();
 *
 *   const handleClick = () => {
 *     navigation.navigate('/dashboard');
 *   };
 * }
 */
export declare function useNavigation(): Navigation;

/**
 * Hook to create and control a popover
 * Replaces PopoverRef class
 *
 * @example
 * function MyComponent() {
 *   const popover = usePopover();
 *
 *   const handleClick = (element: HTMLElement) => {
 *     popover.show({
 *       content: MyPopoverContent,
 *       data: { value: 100 },
 *       position: { ... }
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Show Popover</button>;
 * }
 */
export declare function usePopover(): PopoverHandle;

/**
 * Custom hook for managing radar chart lifecycle
 * Maps to: Angular RadarChartComponent logic (radar-chart.component.ts)
 */
export declare function useRadarChart(options: UseRadarChartOptions): UseRadarChartReturn;

/**
 * Props for the useRadarChart hook
 */
export declare interface UseRadarChartOptions {
    /** Chart title */
    title?: string;
    /** Radar axes definitions */
    axes: RadarAxis[];
    /** Data series to display */
    series: RadarSeries[];
    /** Number of concentric grid levels (default: 10) */
    levels?: number;
    /** Height of the legend section */
    legendHeight?: number;
    /** Position of the legend */
    legendPosition?: LegendPosition;
    /** Whether to show tooltip on hover */
    showTooltip?: boolean;
    /** Callback when a data point is clicked */
    onPointClicked?: (event: RadarPointEvent) => void;
    /** Callback when a series is clicked */
    onSeriesClicked?: (seriesName: string) => void;
}

/**
 * Return type for the useRadarChart hook
 */
export declare interface UseRadarChartReturn {
    /** Ref to attach to the container element */
    containerRef: React.RefObject<HTMLDivElement>;
    /** Force a chart rebuild */
    rebuild: () => void;
}

/**
 * A performant ResizeObserver hook with debouncing and requestAnimationFrame optimization.
 *
 * This hook prevents the "ResizeObserver loop completed with undelivered notifications" error
 * by using a combination of:
 * 1. Debouncing to reduce callback frequency
 * 2. requestAnimationFrame to sync with the browser's paint cycle
 * 3. Dimension comparison to skip unnecessary callbacks
 *
 * @param ref - React ref to the element to observe
 * @param callback - Function to call when element resizes (receives dimensions)
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * // Simple usage
 * useResizeObserver(containerRef, () => {
 *   redrawChart();
 * });
 *
 * // With dimensions
 * useResizeObserver(containerRef, ({ width, height }) => {
 *   console.log(`New size: ${width}x${height}`);
 * });
 *
 * // With custom options
 * useResizeObserver(containerRef, handleResize, {
 *   debounceMs: 150,
 *   threshold: 2,
 * });
 * ```
 */
export declare function useResizeObserver<T extends HTMLElement>(ref: React.RefObject<T>, callback: (dimensions: ResizeObserverDimensions) => void, options?: UseResizeObserverOptions): void;

/**
 * Options for the useResizeObserver hook
 */
export declare interface UseResizeObserverOptions {
    /** Debounce delay in milliseconds (default: RESIZE_DEBOUNCE_MS) */
    debounceMs?: number;
    /** Minimum dimension change in pixels to trigger callback (default: 1) */
    threshold?: number;
}

/**
 * Hook to access time range context
 *
 * @example
 * function MyComponent() {
 *   const { timeRange, setRelativeRange } = useTimeRange();
 *
 *   const handleClick = () => {
 *     setRelativeRange(7, TimeUnit.Day);
 *   };
 * }
 */
export declare function useTimeRange(): TimeRangeContextValue;

export declare function useTopologyOrchestrator(config: UseTopologyOrchestratorConfig): UseTopologyOrchestratorResult;

export declare interface UseTopologyOrchestratorConfig {
    containerRef: React.RefObject<HTMLDivElement | null>;
    nodes: TopologyNode[];
    nodeRenderer: TopologyNodeRenderer;
    edgeRenderer: TopologyEdgeRenderer;
    layoutType?: TopologyLayoutType;
    customLayout?: TopologyLayout;
    nodeDataSpecifiers?: TopologyDataSpecifier[];
    edgeDataSpecifiers?: TopologyDataSpecifier[];
    tooltipComponent?: ComponentType<{
        data: TopologyTooltipData;
        onClose: () => void;
    }>;
    nodeInteractionHandler?: TopologyNodeInteractionHandler;
    edgeInteractionHandler?: TopologyEdgeInteractionHandler;
    draggableNodes?: boolean;
    hoverableNodes?: boolean;
    hoverableEdges?: boolean;
    clickableNodes?: boolean;
    clickableEdges?: boolean;
    showBrush?: boolean;
    shouldAutoZoomToFit?: boolean;
    supportGroupNode?: boolean;
    enableDemarcation?: boolean;
    autoGroupDiscriminator?: string;
    zoomable?: boolean;
}

export declare interface UseTopologyOrchestratorResult {
    stateManager: TopologyStateManager | null;
    zoom: TopologyZoom<SVGSVGElement, SVGGElement> | null;
    currentTopology: (() => RenderableTopology<TopologyNode, TopologyEdge>) | null;
    relayout: (() => void) | null;
    error: string | null;
}

/**
 * Configuration options for value formatting.
 */
export declare interface ValueFormatOptions {
    /** The type of formatting to apply */
    valueType?: ValueType;
    /** Decimal places for Decimal and Percentage types. @default 2 for Decimal, 1 for Percentage */
    decimalPlaces?: number;
}

/**
 * Supported value types for formatting numeric values.
 * Shared across Metric widget, Donut center, and future widgets.
 */
export declare enum ValueType {
    /** Auto-detect integer vs float, apply numeric scaling (K, M, B, T) */
    Auto = "auto",
    /** Format as integer with numeric scaling */
    Integer = "integer",
    /** Format as decimal with configurable decimal places and numeric scaling */
    Decimal = "decimal",
    /** Format as percentage (appends % to value, e.g., 99 → "99.00%") */
    Percentage = "percentage",
    /** Format as duration (ms → "Xd Xh Xm" or "Xm Xs") */
    Duration = "duration",
    /** Format as file size (bytes → KB, MB, GB) */
    FileSize = "fileSize",
    /** Format as ordinal (1 → "1st", 2 → "2nd") */
    Ordinal = "ordinal",
    /** Format as date (epoch timestamp in ms or seconds → formatted date string) */
    Date = "date",
    /** Display raw value without formatting */
    Raw = "raw"
}

export declare class VerticalGraphLayout extends GraphLayout {
    protected assignCoordinatesToNodes(): void;
    protected verticallyCenterAlignNodes(): void;
    protected getLayoutConfig(): TopologyGraphLayoutConfig;
}

/**
 * Default color palette for charts
 * Uses all data visualization tokens from @harnessio/ui package
 */
export declare enum VizColor {
    Blue = "var(--cn-comp-data-viz-01-blue)",
    Purple = "var(--cn-comp-data-viz-02-purple)",
    Pink = "var(--cn-comp-data-viz-03-pink)",
    Green = "var(--cn-comp-data-viz-04-green)",
    Indigo = "var(--cn-comp-data-viz-05-indigo)",
    Brown = "var(--cn-comp-data-viz-06-brown)",
    Cyan = "var(--cn-comp-data-viz-07-cyan)",
    Orange = "var(--cn-comp-data-viz-08-orange)",
    Forest = "var(--cn-comp-data-viz-09-forest)",
    Red = "var(--cn-comp-data-viz-10-red)",
    Yellow = "var(--cn-comp-data-viz-11-yellow)",
    Gray = "var(--cn-comp-data-viz-12-gray)"
}

declare type ZoomEventKeyModifier = Key.Control | Key.Meta;

declare interface ZoomHandlerEvent extends D3ZoomEvent<Element, unknown> {
    sourceEvent: ZoomSourceEvent;
    type: 'start' | 'zoom' | 'end';
}

declare type ZoomSourceEvent = MouseEvent | TouchEvent | null;

export { }
