import React from 'react';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import { create } from 'react-test-renderer';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MatchMediaMock from 'jest-matchmedia-mock';
import { Stat, Tabs, Tab, TabSize, TabVariant } from './';
import { IconName } from '../Icon';

Enzyme.configure({ adapter: new Adapter() });

let matchMedia: any;

describe('Tabs', () => {
    let wrapper: ReactWrapper;

    const tabs = [1, 2, 3, 4].map((i) => ({
        value: `tab${i}`,
        icon: IconName.mdiCardsHeart,
        label: `Tab ${i}`,
        ariaLabel: `Tab ${i}`,
        ...(i === 4 ? { disabled: true } : {}),
    }));
    const tabClick = jest.fn();

    beforeAll(() => {
        matchMedia = new MatchMediaMock();
    });
    afterEach(() => {
        matchMedia.clear();
    });

    beforeEach(() => {
        wrapper = mount(
            <Tabs onChange={tabClick} value={'tab1'}>
                {tabs.map((tab) => (
                    <Tab key={tab.value} {...tab} />
                ))}
            </Tabs>
        );
    });

    test('tabs snapshot', () => {
        expect(
            create(
                <Tabs onChange={tabClick} value={'tab1'}>
                    {tabs.map((tab) => (
                        <Tab key={tab.value} {...tab} />
                    ))}
                </Tabs>
            ).toJSON()
        ).toMatchSnapshot();
    });

    test('tabs mount', () => {
        expect(wrapper.find('.tab').at(0).hasClass('active')).toEqual(true);
    });

    test('tabs click', () => {
        wrapper.find('.tab').at(2).simulate('click');
        expect(tabClick).toHaveBeenCalledTimes(1);
        expect(tabClick).toHaveBeenCalledWith('tab3', expect.any(Object));
    });

    test('setting value changes tab', async () => {
        wrapper = mount(
            <Tabs onChange={tabClick} value={'tab3'}>
                {tabs.map((tab) => (
                    <Tab key={tab.value} {...tab} />
                ))}
            </Tabs>
        );
        expect(wrapper.find('.tab').at(2).hasClass('active')).toEqual(true);
    });

    test('pill tabs large snapshot', () => {
        expect(
            create(
                <Tabs
                    onChange={tabClick}
                    size={TabSize.Large}
                    value={'tab1'}
                    variant={TabVariant.pill}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} {...tab} />
                    ))}
                </Tabs>
            ).toJSON()
        ).toMatchSnapshot();
    });

    test('pill tabs medium (default) snapshot', () => {
        expect(
            create(
                <Tabs
                    onChange={tabClick}
                    value={'tab1'}
                    variant={TabVariant.pill}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} {...tab} />
                    ))}
                </Tabs>
            ).toJSON()
        ).toMatchSnapshot();
    });

    test('pill tabs medium (set) snapshot', () => {
        expect(
            create(
                <Tabs
                    onChange={tabClick}
                    size={TabSize.Medium}
                    value={'tab1'}
                    variant={TabVariant.pill}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} {...tab} />
                    ))}
                </Tabs>
            ).toJSON()
        ).toMatchSnapshot();
    });

    test('pill tabs small snapshot', () => {
        expect(
            create(
                <Tabs
                    onChange={tabClick}
                    size={TabSize.Small}
                    value={'tab1'}
                    variant={TabVariant.pill}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} {...tab} />
                    ))}
                </Tabs>
            ).toJSON()
        ).toMatchSnapshot();
    });

    test('stat tabs medium snapshot', () => {
        expect(
            create(
                <Tabs onChange={tabClick} value={'tab1'}>
                    {tabs.map((tab) => (
                        <Stat key={tab.value} {...tab} />
                    ))}
                </Tabs>
            ).toJSON()
        ).toMatchSnapshot();
    });

    test('stat tabs small snapshot', () => {
        expect(
            create(
                <Tabs onChange={tabClick} size={TabSize.Small} value={'tab1'}>
                    {tabs.map((tab) => (
                        <Stat key={tab.value} {...tab} />
                    ))}
                </Tabs>
            ).toJSON()
        ).toMatchSnapshot();
    });
});
