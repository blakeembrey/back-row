/// <reference path='../react/react.d.ts' />

declare module 'react-list' {
  import React = require('react')

  interface ListProps {
    axis?: string;
    initialIndex?: number;
    itemSizeGetter?(index: number): number;
    itemRenderer?(index: number, key: number): React.ReactElement<any>;
    itemsRenderer?(items: any[], ref: string): React.ReactElement<any>;
    length?: number;
    pageSize?: number;
    threshold?: number;
    type?: string;
  }

  interface ListState {
    from: number;
    size: number;
    itemsPerRow: number;
  }

  class List extends React.Component<ListProps, ListState> {
    componentWillReceiveProps(next: any): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    getScrollParent(): HTMLElement;
    getScroll(): number;
    getViewportHeight(): number;
    updateFrame(): void;
    render(): React.ReactElement<any>;
    shouldComponentUpdate(): any;
  }

  export = List;
}
