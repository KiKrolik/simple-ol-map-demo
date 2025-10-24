import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Sidebar from "../Sidebar";
import type { LayerVisibility, ChartType } from "../../types";

// Sample props for testing
const defaultProps = {
  layerVisibility: {
    osm: true,
    voivodeships: true,
    lines: true,
    charts: false,
    mask: true,
  } as LayerVisibility,
  onToggleLayer: vi.fn(),
  chartType: "pie" as ChartType,
  onChangeChartType: vi.fn(),
};

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sidebar with correct title", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText("Mapa Polski")).toBeInTheDocument();
  });

  it("renders layer toggle switches", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByLabelText("Województwa")).toBeInTheDocument();
    expect(screen.getByLabelText("Linie komunikacyjne")).toBeInTheDocument();
    expect(screen.getByLabelText("Wykresy danych")).toBeInTheDocument();
  });

  it("reflects correct initial toggle states", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByLabelText("Województwa")).toBeChecked();
    expect(screen.getByLabelText("Linie komunikacyjne")).toBeChecked();
    expect(screen.getByLabelText("Wykresy danych")).not.toBeChecked();
  });

  it("calls onToggleLayer when switches are clicked", () => {
    render(<Sidebar {...defaultProps} />);

    fireEvent.click(screen.getByLabelText("Województwa"));
    expect(defaultProps.onToggleLayer).toHaveBeenCalledWith("voivodeships");

    fireEvent.click(screen.getByLabelText("Linie komunikacyjne"));
    expect(defaultProps.onToggleLayer).toHaveBeenCalledWith("lines");

    fireEvent.click(screen.getByLabelText("Wykresy danych"));
    expect(defaultProps.onToggleLayer).toHaveBeenCalledWith("charts");
  });

  it("does not show chart types section when charts layer is disabled", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.queryByText("Typ wykresów")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("🥧 Wykresy kołowe")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("📊 Wykresy słupkowe")
    ).not.toBeInTheDocument();
  });

  it("shows chart types section when charts layer is enabled", () => {
    const propsWithChartsEnabled = {
      ...defaultProps,
      layerVisibility: {
        ...defaultProps.layerVisibility,
        charts: true,
      },
    };

    render(<Sidebar {...propsWithChartsEnabled} />);

    expect(screen.getByText("Typ wykresów")).toBeInTheDocument();
    expect(screen.getByLabelText("🥧 Wykresy kołowe")).toBeInTheDocument();
    expect(screen.getByLabelText("📊 Wykresy słupkowe")).toBeInTheDocument();
  });

  it("reflects correct chart type selection", () => {
    const propsWithChartsEnabled = {
      ...defaultProps,
      layerVisibility: {
        ...defaultProps.layerVisibility,
        charts: true,
      },
      chartType: "bar" as ChartType,
    };

    render(<Sidebar {...propsWithChartsEnabled} />);

    expect(screen.getByLabelText("🥧 Wykresy kołowe")).not.toBeChecked();
    expect(screen.getByLabelText("📊 Wykresy słupkowe")).toBeChecked();
  });

  it("calls onChangeChartType when chart type is changed", () => {
    const propsWithChartsEnabled = {
      ...defaultProps,
      layerVisibility: {
        ...defaultProps.layerVisibility,
        charts: true,
      },
    };

    render(<Sidebar {...propsWithChartsEnabled} />);

    fireEvent.click(screen.getByLabelText("📊 Wykresy słupkowe"));
    expect(defaultProps.onChangeChartType).toHaveBeenNthCalledWith(1, "bar");
  });
});
