
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';


const PageLayout = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
`;

const NavArea = styled.div`
    flex-shrink: 0;
`;

const ContentArea = styled.div`
    flex: 1;
    overflow-y: auto;
`;

/**
 * Page layout component replacing @atlaskit/page.
 * Renders a sidebar navigation area on the left and a scrollable content area.
 *
 * @param {Object} props - Component props.
 * @returns {ReactElement}
 */
const Page = ({ navigation, children }) => (
    <PageLayout>
        { navigation && <NavArea>{ navigation }</NavArea> }
        <ContentArea>{ children }</ContentArea>
    </PageLayout>
);

Page.propTypes = {
    children: PropTypes.node,
    navigation: PropTypes.node
};

export default Page;
