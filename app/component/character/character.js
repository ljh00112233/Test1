import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { getCharacterInfo } from './lostArkApi';

const character = () => {
    const [characterName, setCharacterName] = useState('');
    const [characterData, setCharacterData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchCharacter = async () => {
        if (!characterName.trim()) {
            setError('캐릭터 이름을 입력하세요.');
            return;
        }

        setLoading(true);
        setError(null);
        setCharacterData(null);

        try {
            const data = await getCharacterInfo(characterName.trim());
            setCharacterData(data);
        } catch (err) {
            console.error(err);
            setError('캐릭터를 찾을 수 없습니다. 이름을 다시 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="캐릭터 이름"
                    placeholderTextColor='#7D818C'
                    value={characterName}
                    onChangeText={setCharacterName}
                    onSubmitEditing={searchCharacter}
                />
                <Button title="검색" color='#37393A' onPress={searchCharacter} />
            </View>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.error}>{error}</Text>}
            {characterData && <CharacterDetails data={characterData} />}
        </SafeAreaView>
    );
};

const CharacterDetails = ({ data }) => {
    const {
        ArmoryProfile,
        ArmoryEquipment,
        ArmoryAvatars,
        ArmorySkills,
        ArmoryCard,
        ArmoryGem,
        ArkPassive,
        Collectibles
    } = data;

    const removeHtmlTags = (str) => {
        if (typeof str === 'string') {
            return str.replace(/<[^>]*>/g, '');  // < > 사이의 내용을 모두 제거
        }
        return str;  // 만약 문자열이 아니면 그대로 반환
    };

    //ArmoryProfile
    const [ArmoryProfileTooltip, setArmoryProfileTooltip] = useState('');
    const [isArmoryProfileTooltipVisible, setIsArmoryProfileTooltipVisible] = useState(false);
    const showArmoryProfileTooltip = (tooltip) => {
        setArmoryProfileTooltip(tooltip);
        setIsArmoryProfileTooltipVisible(true);
    };

    const closeArmoryProfileTooltip = () => {
        setIsArmoryProfileTooltipVisible(false);
        setArmoryProfileTooltip('');
    };
    const {
        Stats,
        Tendencies,
    } = ArmoryProfile;

    const cleanStats = Stats.map(stat => ({
        ...stat,
        Tooltip: Array.isArray(stat.Tooltip)
            ? stat.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(stat.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));

    //ArmoryEquipment
    const [ArmoryEquipmenttooltip, setArmoryEquipmenttooltip] = useState('');
    const [isArmoryEquipmentTooltipVisible, setIsArmoryEquipmentTooltipVisible] = useState(false);
    const cleanArmoryEquipment = ArmoryEquipment.map(type => ({
        ...type,
        Tooltip: Array.isArray(type.Tooltip)
            ? type.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(type.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));

    const showArmoryEquipment = (tooltip) => {
        const cleanedArmoryEquipmentTooltip = tooltip.replace(/\r\n|\n|\r/g, "");
        const EquipmentTooltip = JSON.parse(cleanedArmoryEquipmentTooltip);
        const {
            Element_000: { value: value_000 },
            Element_001: { value: { leftStr0, leftStr1, leftStr2, qualityValue, rightStr0 } },
            Element_002: { value: value_002 },
            Element_003: { value: value_003 },
            Element_004: { value: value_004 },
            Element_005: { value: value_005 },
        } = EquipmentTooltip;
        setArmoryEquipmenttooltip(`${leftStr2}\n${value_000}\n${leftStr0}\n${leftStr1}: ${qualityValue}\n${rightStr0}\n${value_002}\n${value_003}${value_004}\n${value_005}`);
        setIsArmoryEquipmentTooltipVisible(true);
    };
    const closeArmoryEquipmentTooltip = () => {
        setIsArmoryEquipmentTooltipVisible(false);
        setArmoryEquipmenttooltip('');
    };

    //ArmoryAvatars
    const cleanArmoryAvatars = ArmoryAvatars.map(type => ({
        ...type,
        Tooltip: Array.isArray(type.Tooltip)
            ? type.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(type.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));
    const [ArmoryAvatarsTooltip, setArmoryAvatarsTooltip] = useState('');
    const [isArmoryAvatarsTooltipVisible, setIsArmoryAvatarsTooltipVisible] = useState(false);
    const imageUrl = `${ArmoryProfile.CharacterImage}`;
    const showArmoryAvatarsTooltip = (tooltip) => {
        const cleanedArmoryAvatarsTooltip = tooltip.replace(/\r\n|\n|\r/g, "");
        const ArmoryAvatarsTooltip = JSON.parse(cleanedArmoryAvatarsTooltip);
        const {
            Element_000: { value: value_000 },
            Element_001: { value: { leftStr0 } },
            Element_002: { value: value_002 },
            Element_003: { value: value_003 },
            Element_004: { value: value_004 },
        } = ArmoryAvatarsTooltip;
        setArmoryAvatarsTooltip(`\n${value_000}\n${leftStr0}\n${value_002}\n${value_003}${value_004}`);
        console.log(ArmoryAvatarsTooltip);
        setIsArmoryAvatarsTooltipVisible(true);
    };

    const closeArmoryAvatarsTooltip = () => {
        setIsArmoryAvatarsTooltipVisible(false);
        setArmoryAvatarsTooltip('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.resultContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.characterImage}
                    resizeMode="cover"
                    onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                />
                <Text style={styles.characterName}>{ArmoryProfile.CharacterName}</Text>
                <Text style={styles.text}>서버: {ArmoryProfile.ServerName}</Text>
                <Text style={styles.text}>원정대 레벨: {ArmoryProfile.TownLevel}</Text>
                <Text style={styles.text}>전투 레벨: {ArmoryProfile.TownLevel}</Text>
                <Text style={styles.text}>아이템 레벨: {ArmoryProfile.ItemAvgLevel}</Text>
                <Text style={styles.text}>칭호: {ArmoryProfile.Title}</Text>
                <Text style={styles.text}>길드: {ArmoryProfile.GuildName}</Text>
                <Text style={styles.text}>특성</Text>
                {cleanStats.map(({ Type, Value, Tooltip }) => (
                    <View>
                        <TouchableOpacity onPress={() => showArmoryProfileTooltip(Tooltip)}>
                            <Text style={styles.text2}>{Type}:{Value}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isArmoryProfileTooltipVisible}
                    onRequestClose={closeArmoryProfileTooltip}
                >
                    <TouchableWithoutFeedback onPress={closeArmoryProfileTooltip}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <ScrollView>
                                        <Text style={styles.text2}>{ArmoryProfileTooltip}</Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Text style={styles.text}>성향</Text>
                {Tendencies.map(({ Type, Point }) => (
                    <Text style={styles.text2}>{Type}:{Point}</Text>
                ))}
                <Text style={styles.text}>장비</Text>
                {cleanArmoryEquipment.map(({ Type, Name, Icon, Tooltip }) => (
                    <View>
                        <TouchableOpacity onPress={() => { showArmoryEquipment(Tooltip); }}>
                            <Text style={styles.text2}>{Type}</Text>
                            <Text style={styles.text2}>{Name}</Text>
                            <Image
                                source={{ uri: Icon }}
                                style={styles.itemImage}
                                resizeMode="cover"
                                onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                            />
                        </TouchableOpacity>
                    </View>
                ))}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isArmoryEquipmentTooltipVisible}
                    onRequestClose={closeArmoryEquipmentTooltip}
                >
                    <TouchableWithoutFeedback onPress={closeArmoryEquipmentTooltip}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <ScrollView>
                                        <Text style={styles.text2}>{ArmoryEquipmenttooltip}</Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <Text style={styles.text}>아바타</Text>
                {cleanArmoryAvatars.map(({ Type, Name, Icon, Grade, Tooltip }) => (
                    <View>
                        <TouchableOpacity onPress={() => { showArmoryAvatarsTooltip(Tooltip); }}>
                            <Text style={styles.text2}>{Type}</Text>
                            <Text style={styles.text2}>{Name}</Text>
                            <Text style={styles.text2}>{Grade}</Text>
                            <Image
                                source={{ uri: Icon }}
                                style={styles.itemImage}
                                resizeMode="cover"
                                onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                            />
                        </TouchableOpacity>
                    </View>
                ))}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isArmoryAvatarsTooltipVisible}
                    onRequestClose={closeArmoryAvatarsTooltip}
                >
                    <TouchableWithoutFeedback onPress={closeArmoryAvatarsTooltip}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <ScrollView>
                                        <Text style={styles.text2}>{ArmoryAvatarsTooltip}</Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.text}>{Type}:{Value}</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"       // 모달이 나타나는 애니메이션 ('slide', 'fade' 등 사용 가능)
                    visible={modalVisible}      // 모달 보이기 여부
                    onRequestClose={() => setModalVisible(false)} // 모달 닫기 함수
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.text}>{cleanTooltip}</Text>
                            <Button title="닫기" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal> */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    nameText: {
        fontSize: 80,
        color: 'white',
    },
    searchContainer: {
        marginBottom: 24,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: '#37393A',
        color: '#FFFFFF',
    },
    error: {
        color: 'red',
        marginBottom: 12,
    },
    resultContainer: {
        flex: 1,
        width: '100%',
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    characterImage: {
        height: 250,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#e0e0e0',
    },
    itemImage: {
        height: 50,
        width: 50,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#e0e0e0',
    },
    characterName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    button: {
        color: '#37393A'
    },
    text: {
        fontSize: 25,
    },
    text2: {
        fontSize: 15,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    scrollView: {
        marginTop: 20,
    },
});

export default character;