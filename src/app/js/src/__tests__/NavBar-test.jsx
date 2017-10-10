// Link.react-test.js
import React from 'react';
import renderer from 'react-test-renderer';

import NavBar from '../NavBar';

test('NavBar changes the class when hovered', () => {
    const component = renderer.create(
        <NavBar />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // manually trigger the callback
    tree.props.expand();
    // re-rendering
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});