import React from 'react';
import { SketchPicker } from 'react-color';

export type ColorConfigType = string | undefined;

// value 初始值传来，onchange item给的回调
interface ColorProps {
  value?: ColorConfigType;
  onChange?: (v: ColorConfigType) => void;
}

class colorPicker extends React.Component<ColorProps> {
  state = {
    displayColorPicker: false,
    color: this.props.value || 'transparent',
  };

  handleClick = () => {
    const { displayColorPicker } = this.state;
    this.setState({ displayColorPicker: !displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color: { hex: string }) => {
    this.setState({ color: color.hex });
    this.props.onChange && this.props.onChange(color.hex);
  };

  clearColor = () => {
    this.setState({
      color: 'transparent',
    });
    this.props.onChange && this.props.onChange('');
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                // padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
              }}
              onClick={this.handleClick}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '2px',
                  background: this.state.color,
                }}
              />
            </div>
            <div
              style={{
                margin: '0 10px',
                color: '#6c6c6c',
              }}
            >
              {this.state.color !== 'transparent' && this.state.color}
            </div>
          </div>

          {this.state.color !== 'transparent' && (
            <div
              style={{
                backgroundColor: '#1890ff',
                color: '#fff',
                borderRadius: '30px',
                padding: '5px 10px',
              }}
              onClick={this.clearColor}
            >
              清除
            </div>
          )}
        </div>

        {this.state.displayColorPicker ? (
          <React.Fragment>
            <div
              style={{
                position: 'absolute',
                zIndex: 2000,
              }}
            >
              <SketchPicker color={this.state.color} onChange={this.handleChange} />
            </div>
            <div
              style={{
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
                zIndex: 1000,
              }}
              onClick={this.handleClose}
            />
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default colorPicker;
