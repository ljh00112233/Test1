import React from "react";
import { Link } from "expo-router";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #151720;
    align-items: center;
    justify-content: center;
`;

const List = () => {
    return (
        <Container>
            <TouchableOpacity style={{margin:10}}>
                <Link
                    style={{borderRadius: 10, padding: 20, margin: 10, textAlign: 'center', color: '#fff', backgroundColor: '#37393A',fontSize:30}} 
                    href='./component/Home'>
                    캐릭터 검색
                </Link>
                <Link
                    style={{borderRadius: 10, padding: 20, margin: 10, textAlign: 'center', color: '#fff', backgroundColor: '#37393A',fontSize:30}} 
                    href='./component/expedition/expedition'>
                    원정대 검색
                </Link>
                <Link
                    style={{borderRadius: 10, padding: 20, margin: 10, textAlign: 'center', color: '#fff', backgroundColor: '#37393A',fontSize:30}} 
                    href='./component/Calendar'>
                    일정
                </Link>
                <Link
                    style={{borderRadius: 10, padding: 20, margin: 10, textAlign: 'center', color: '#fff', backgroundColor: '#37393A',fontSize:30}} 
                    href='./component/announcement'>
                    공지사항
                </Link>
                <Link
                    style={{borderRadius: 10, padding: 20, margin: 10, textAlign: 'center', color: '#fff', backgroundColor: '#37393A',fontSize:30}} 
                    href='./component/Event'>
                    이벤트
                </Link>
            </TouchableOpacity>
        </Container>
    );
};

export default List;