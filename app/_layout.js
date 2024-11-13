import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);
    return (
        <Stack screenOptions={{
            cardStyle: {backgroundColor: '#ffffff'},
            headerStyle: {
                height: 110,
                backgroundColor: '#95a5a6',
                borderBottomWidth: 5,
                borderBottomColor: '#34495e',
            },
            headerTitleStyle: {color: '#ffffff', fontSize: 24},
            headerTitleAlign: 'center',
        }}>
            <Stack.Screen name='index' options={{
                headerTitle: 'LoaHub',
            }}
            />
            <Stack.Screen name='component/Home' options={{
                headerTitle: '캐릭터 검색',
            }}
            />
            <Stack.Screen name='component/expedition/expedition' options={{
                headerTitle: '원정대 검색',
            }}
            />
            <Stack.Screen name='component/Calendar' options={{
                headerTitle: '일정',
            }}
            />
            <Stack.Screen name='component/announcement' options={{
                headerTitle: '공지사항',
            }}
            />
            <Stack.Screen name='component/Event' options={{
                headerTitle: '이벤트',
            }}
            />
        </Stack>
    )
}