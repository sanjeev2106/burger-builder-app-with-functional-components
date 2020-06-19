import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Bacone', type: 'bacone'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'}
]

const buildControls = (props) => (   
    <div className={classes.BuildControls}>
        {controls.map(crtl => (
            <BuildControl key={crtl.label} label={crtl.label} />
        ))}
    </div>
);

export default buildControls;