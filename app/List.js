import React, { useRef } from "react";
import { Link } from "expo-router";
import styled from "styled-components/native";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView } from "react-native";
import Announcement from './component/announcement';
import Event from './component/Event';
import Calendar from "./component/Calendar";

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #151720;
    align-items: center;
    justify-content: center;
`;

const List = () => {
    const scrollViewRef = useRef(null);
    const scrollToTop = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true }); // y: 0은 맨 위로 이동
        }
    };

    return (
        <Container>
            <TouchableOpacity style={styles.button} onPress={scrollToTop}>
                <Text style={styles.buttonText}>▲</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.LOAHUBButton}>
                <Link
                href='./List'>
                    <Text style={styles.titleText}>LOAHUB</Text>
                </Link>
            </TouchableOpacity>
            <ScrollView ref={scrollViewRef}>
                <TouchableOpacity style={styles.touchableOpacity}>
                    <Link
                        style={styles.linkStyle}
                        href='./component/character/Home'>
                        캐릭터 검색
                    </Link>
                    <Link
                        style={styles.linkStyle}
                        href='./component/expedition/expedition'>
                        원정대 검색
                    </Link>
                    <Link
                        style={styles.linkStyle}
                        href='./component/post/post'>
                        게시판
                    </Link>
                </TouchableOpacity>
                <View style={styles.subContainer}>
                    <Announcement />
                    <Event />
                </View>
                <View style={{ margin: 20 }}>
                    <Calendar />
                </View>
            </ScrollView>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151720'
    },
    subContainer: {
        flexDirection: 'row', 
        margin:20, 
        alignItems:'center', 
        justifyContent: 'space-between',
    },
    linkStyle: {
        padding: 15, 
        borderRadius: 10, 
        margin: 5, 
        textAlign: 'center', 
        color: '#fff', 
        backgroundColor: '#37393A', 
        fontSize: 20
    },
    titleText: {
        fontSize:50, color: '#F7F7F0'
    },
    button: {
        position: 'absolute',
        bottom: 3,
        right: 1,
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        zIndex: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    LOAHUBButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableOpacity: {
        margin: 10, 
        flexDirection: 'row', 
        flexWrap: 'wrap',
    },
});

export default List;