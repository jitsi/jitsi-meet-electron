
import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
    children?: ReactNode;
    navigation?: ReactNode;
}

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
 * @param {IProps} props - Component props.
 * @returns {ReactElement}
 */
const Page = ({ navigation, children }: IProps) => (
    <PageLayout>
        { navigation && <NavArea>{ navigation }</NavArea> }
        <ContentArea>{ children }</ContentArea>
    </PageLayout>
);

export default Page;
