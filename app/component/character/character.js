import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { getCharacterInfo } from './lostArkApi';
import { Link } from "expo-router";

const character = () => {
    const [characterName, setCharacterName] = useState('');
    const [characterData, setCharacterData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchCharacter = async () => {
        const data = await getCharacterInfo(characterName.trim());
        if (!characterName.trim()) {
            setError(null);
            setCharacterData(null);
            setError('캐릭터 이름을 입력하세요.');
            return;
        }
        if(!data) {
            setError(null);
            setCharacterData(null);
            setError('캐릭터를 찾을 수 없습니다. 이름을 다시 확인해주세요.');
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
            <TouchableOpacity style={styles.LOAHUBButton}>
                <Link
                href='../../List'>
                    <Text style={{fontSize:50, color: '#F7F7F0'}}>LOAHUB</Text>
                </Link>
            </TouchableOpacity>
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

    const [isArmoryProfileVisible, setIsArmoryProfileVisible] = useState(true);
    const [isArkpassivesVisible, setIsArkpassivesVisible] = useState(false);
    const [isArmoryAvatarsVisible, setIsArmoryAvatarsVisible] = useState(false);
    const [isCollectiblesVisible, setIsCollectiblesVisible] = useState(false);
    const [isSkillVisible, setIsSkillVisible] = useState(false);

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
    const [ArmoryEquipmenttooltip, setArmoryEquipmentTooltip] = useState('');
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
        const ArmoryEquipmentconvertedData = Object.entries(EquipmentTooltip).map(([key, value]) => ({
            key,
            ...value,
        }));
        function ArmoryEquipmentValues(obj, result = []) {
            for (const key in obj) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    // 하위 객체인 경우 재귀 호출
                    ArmoryEquipmentValues(obj[key], result);
                } else {
                    // 기본 값인 경우 결과에 추가
                    result.push(obj[key]);
                }
            }
            return result;
        }
        const ArmoryEquipmentallValues = ArmoryEquipmentValues(ArmoryEquipmentconvertedData);
        const ArmoryEquipmentfilteredArr = ArmoryEquipmentallValues.filter((item) => !/[a-zA-Z]/.test(item));
        const ArmoryEquipmentremoveIndexes = [1, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 27, 28, 29, 30, 31, 32];
        const ArmoryEquipmentnewArr = ArmoryEquipmentfilteredArr.filter((_, index) => !ArmoryEquipmentremoveIndexes.includes(index));
        let ArmoryEquipmentfilterValues = "";
        ArmoryEquipmentnewArr.map((item) => {
            ArmoryEquipmentfilterValues += `${item}\n`;
            setArmoryEquipmentTooltip(ArmoryEquipmentfilterValues);
        });
        setIsArmoryEquipmentTooltipVisible(true);
    };
    const closeArmoryEquipmentTooltip = () => {
        setIsArmoryEquipmentTooltipVisible(false);
        setArmoryEquipmentTooltip('');
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
        const ArmoryAvatarsconvertedData = Object.entries(ArmoryAvatarsTooltip).map(([key, value]) => ({
            key,
            ...value,
        }));
        function ArmoryAvatarsValues(obj, result = []) {
            for (const key in obj) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    // 하위 객체인 경우 재귀 호출
                    ArmoryAvatarsValues(obj[key], result);
                } else {
                    // 기본 값인 경우 결과에 추가
                    result.push(obj[key]);
                }
            }
            return result;
        }
        const ArmoryAvatarsallValues = ArmoryAvatarsValues(ArmoryAvatarsconvertedData);
        const ArmoryAvatarsfilteredArr = ArmoryAvatarsallValues.filter((item) => !/[a-zA-Z]/.test(item));
        const ArmoryAvatarsremoveIndexes = [1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14 ,15 ,16 ,17];
        const ArmoryAvatarsnewArr = ArmoryAvatarsfilteredArr.filter((_, index) => !ArmoryAvatarsremoveIndexes.includes(index));
        let ArmoryAvatarsfilterValues = "";
        ArmoryAvatarsnewArr.map((item) => {
            ArmoryAvatarsfilterValues += `${item}\n`;
            setArmoryAvatarsTooltip(ArmoryAvatarsfilterValues);
        });
        setIsArmoryAvatarsTooltipVisible(true);
    };
    const closeArmoryAvatarsTooltip = () => {
        setIsArmoryAvatarsTooltipVisible(false);
        setArmoryAvatarsTooltip('');
    };

    //ArmorySkills
    const cleanArmorySkills = ArmorySkills.map(type => ({
        ...type,
        Tooltip: Array.isArray(type.Tooltip)
            ? type.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(type.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));
    const [ArmorySkillsTooltip, setArmorySkillsTooltip] = useState('');
    const [isArmorySkillsTooltipVisible, setIsArmorySkillsTooltipVisible] = useState(false);
    const showArmorySkillsTooltip = (tooltip) => {
        const cleanedArmorySkillsTooltip = tooltip.replace(/\r\n|\n|\r/g, "");
        const ArmorySkillsTooltip = JSON.parse(cleanedArmorySkillsTooltip);
        const ArmorySkillsconvertedData = Object.entries(ArmorySkillsTooltip).map(([key, value]) => ({
            key,
            ...value,
        }));
        function ArmorySkillsValues(obj, result = []) {
            for (const key in obj) {
                if (typeof obj[key] === "object" && obj[key] !== null) {
                    // 하위 객체인 경우 재귀 호출
                    ArmorySkillsValues(obj[key], result);
                } else {
                    // 기본 값인 경우 결과에 추가
                    result.push(obj[key]);
                }
            }
            return result;
        }
        const ArmorySkillsallValues = ArmorySkillsValues(ArmorySkillsconvertedData);
        const ArmorySkillsfilteredArr = ArmorySkillsallValues.filter((item) => !/[a-zA-Z]/.test(item));
        const ArmorySkillsremoveIndexes = [3, 5, 6];
        const ArmorySkillsnewArr = ArmorySkillsfilteredArr.filter((_, index) => !ArmorySkillsremoveIndexes.includes(index));
        let ArmorySkillsfilterValues = "";
        ArmorySkillsnewArr.map((item) => {
            ArmorySkillsfilterValues += `${item}\n`;
            setArmorySkillsTooltip(ArmorySkillsfilterValues);
        });
        setIsArmorySkillsTooltipVisible(true);
    };

    const closeArmorySkillsTooltip = () => {
        setIsArmorySkillsTooltipVisible(false);
        setArmorySkillsTooltip('');
    };

    //ArmoryCard
    const {
        Cards,
        Effects: [{ Items }],
    } = ArmoryCard;
    const cleanCards = Cards.map(type => ({
        ...type,
        Tooltip: Array.isArray(type.Tooltip)
            ? type.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(type.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));
    const [CardsTooltip, setCardsTooltip] = useState('');
    const [isCardsTooltipVisible, setIsCardsTooltipVisible] = useState(false);
    const showCardsTooltip = () => {
        let i = 0;
        let CardsTooltipText = "";
        while (i < Items.length) {
            CardsTooltipText += `${Items[i].Name}\n${Items[i].Description}\n\n`;
            i++;
        };
        setCardsTooltip(CardsTooltipText);
        setIsCardsTooltipVisible(true);
    };

    const closeCardsTooltip = () => {
        setIsCardsTooltipVisible(false);
        setCardsTooltip('');
    };

    //ArmoryGem
    const {
        Gems,
    } = ArmoryGem;
    const cleanGem = Gems.map(type => ({
        ...type,
        Tooltip: Array.isArray(type.Tooltip)
            ? type.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(type.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));

    //ArkPassive
    const {
        IsArkPassive,
        Points,
        Effects,
    } = ArkPassive

    const cleanPoints = Points.map(type => ({
        ...type,
        Tooltip: Array.isArray(type.Tooltip)
            ? type.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(type.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));
    const [PointsTooltip, setPointsTooltip] = useState('');
    const [isPointsTooltipVisible, setIsPointsTooltipVisible] = useState(false);
    const showPointsTooltip = (tooltip) => {
        setPointsTooltip(tooltip);
        setIsPointsTooltipVisible(true);
    };

    const closePointsTooltip = () => {
        setIsPointsTooltipVisible(false);
        setPointsTooltip('');
    };

    const cleanEffects = Effects.map(type => ({
        ...type,
        Tooltip: Array.isArray(type.Tooltip)
            ? type.Tooltip.map(tooltip => removeHtmlTags(tooltip))  // Tooltip이 배열인 경우 각 항목에서 HTML 태그 제거
            : removeHtmlTags(type.Tooltip)  // Tooltip이 문자열인 경우 HTML 태그 제거
    }));

    //Collectibles
    const [CollectiblesTooltip, setCollectiblesTooltip] = useState('');
    const [isCollectiblesTooltipVisible, setIsCollectiblesTooltipVisible] = useState(false);
    const showCollectiblesTooltip = (tooltip) => {
        let i = 0;
        let CollectiblesText = "";
        while (i < tooltip.length) {
            CollectiblesText += `${tooltip[i].PointName}: ${tooltip[i].Point}/${tooltip[i].MaxPoint}\n`;
            i++;
        };
        setCollectiblesTooltip(CollectiblesText);
        setIsCollectiblesTooltipVisible(true);
    };

    const closeCollectiblesTooltip = () => {
        setIsCollectiblesTooltipVisible(false);
        setCollectiblesTooltip('');
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

                <View style={{flexDirection: 'row', justifyContent:'space-evenly', marginTop: 5, marginBottom: 5}}>
                    <TouchableOpacity 
                        style={styles.TouchableOpacityButton}
                        onPress={() => {
                            setIsArmoryProfileVisible(true);
                            setIsArkpassivesVisible(false);
                            setIsArmoryAvatarsVisible(false);
                            setIsCollectiblesVisible(false);
                            setIsSkillVisible(false);
                        }}>
                        <Text style={{color: '#F7F7F0'}}>장비</Text>    
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.TouchableOpacityButton}
                        onPress={() => {
                            setIsArmoryProfileVisible(false);
                            setIsArkpassivesVisible(true);
                            setIsArmoryAvatarsVisible(false);
                            setIsCollectiblesVisible(false);
                            setIsSkillVisible(true);
                        }}>
                        <Text style={{color: '#F7F7F0'}}>스킬</Text>    
                    </TouchableOpacity>
                    {IsArkPassive && (
                        <TouchableOpacity 
                        style={styles.TouchableOpacityButton}
                        onPress={() => {
                            setIsArmoryProfileVisible(false);
                            setIsArkpassivesVisible(true);
                            setIsArmoryAvatarsVisible(false);
                            setIsCollectiblesVisible(false);
                            setIsSkillVisible(false);
                        }}>
                        <Text style={{color: '#F7F7F0'}}>아크패시브</Text>    
                    </TouchableOpacity>)}
                    <TouchableOpacity 
                        style={styles.TouchableOpacityButton}
                        onPress={() => {
                            setIsArmoryProfileVisible(false);
                            setIsArkpassivesVisible(false);
                            setIsArmoryAvatarsVisible(true);
                            setIsCollectiblesVisible(false);
                            setIsSkillVisible(false);
                        }}>
                        <Text style={{color: '#F7F7F0'}}>아바타</Text>    
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.TouchableOpacityButton}
                        onPress={() => {
                            setIsArmoryProfileVisible(false);
                            setIsArkpassivesVisible(false);
                            setIsArmoryAvatarsVisible(false);
                            setIsCollectiblesVisible(true);
                            setIsSkillVisible(false);
                        }}>
                        <Text style={{color: '#F7F7F0'}}>수집품</Text>    
                    </TouchableOpacity>
                </View>
                
                {isArmoryProfileVisible && (<Text style={styles.text}>특성</Text>)}
                {isArmoryProfileVisible && cleanStats.map(({ Type, Value, Tooltip }) => (
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
                {isArmoryProfileVisible && (<Text style={styles.text}>성향</Text>)}
                {isArmoryProfileVisible && Tendencies.map(({ Type, Point }) => (
                    <Text style={styles.text2}>{Type}:{Point}</Text>
                ))}
                {isArmoryProfileVisible && (<Text style={styles.text}>장비</Text>)}
                {isArmoryProfileVisible && cleanArmoryEquipment.map(({ Type, Name, Icon, Tooltip }) => (
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
                {isSkillVisible && (<Text style={styles.text}>스킬</Text>)}
                {isSkillVisible && cleanArmorySkills.map(({ Name, Icon, Level, Tooltip }) => (
                    <View>
                        {Level > 1 && <TouchableOpacity onPress={() => { showArmorySkillsTooltip(Tooltip); }}>
                            <Text style={styles.text2}>{Name}</Text>
                            <Text style={styles.text2}>스킬레벨: {Level}</Text>
                            <Image
                                source={{ uri: Icon }}
                                style={styles.itemImage}
                                resizeMode="cover"
                                onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                            />
                        </TouchableOpacity>}
                    </View>
                ))}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isArmorySkillsTooltipVisible}
                    onRequestClose={closeArmorySkillsTooltip}
                >
                    <TouchableWithoutFeedback onPress={closeArmorySkillsTooltip}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <ScrollView>
                                        <Text style={styles.text2}>{ArmorySkillsTooltip}</Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {isArmoryProfileVisible && (<Text style={styles.text}>보석</Text>)}
                {isArmoryProfileVisible && cleanGem.map(({ Name, Icon, Tooltip }) => {
                    let GemsTooltip = removeHtmlTags(Tooltip);
                    const cleanedGemTooltip = GemsTooltip.replace(/\r\n|\n|\r/g, "");
                    const GemTooltip = JSON.parse(cleanedGemTooltip);
                    const GemconvertedData = Object.entries(GemTooltip).map(([key, value]) => ({
                        key,
                        ...value,
                    }));
                    function GemValues(obj, result = []) {
                        for (const key in obj) {
                            if (typeof obj[key] === "object" && obj[key] !== null) {
                                // 하위 객체인 경우 재귀 호출
                                GemValues(obj[key], result);
                            } else {
                                // 기본 값인 경우 결과에 추가
                                result.push(obj[key]);
                            }
                        }
                        return result;
                    }
                    const GemallValues = GemValues(GemconvertedData);
                    const GemfilteredArr = GemallValues.filter((item) => !/[a-zA-Z]/.test(item));
                    const GemremoveIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24];
                    const GemnewArr = GemfilteredArr.filter((_, index) => !GemremoveIndexes.includes(index));
                    return(
                    <View>
                            <Text style={styles.text2}>{removeHtmlTags(Name)}</Text>
                            <Text style={styles.text2}>{GemnewArr}</Text>
                            <Image
                                source={{ uri: Icon }}
                                style={styles.itemImage}
                                resizeMode="cover"
                                onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                            />
                    </View>
                )})}
                {isArmoryProfileVisible && (<Text style={styles.text}>카드</Text>)}
                <TouchableOpacity onPress={() => { showCardsTooltip() }}>
                    {isArmoryProfileVisible && 
                        <View>
                            <Text style={styles.text2}>{Items[0].Name.replace('2세트' || '3세트', '')}</Text>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        
                        {isArmoryProfileVisible && cleanCards.map(({ Name, Icon, AwakeCount }) => (
                            <View>
                                <Text style={styles.text2}>{AwakeCount}/5</Text>
                                <Image
                                    source={{ uri: Icon }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                    onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                                />
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isCardsTooltipVisible}
                    onRequestClose={closeCardsTooltip}
                >
                    <TouchableWithoutFeedback onPress={closeCardsTooltip}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <ScrollView>
                                        <Text style={styles.text2}>{CardsTooltip}</Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {isArkpassivesVisible && (<Text style={styles.text}>아크패시브</Text>)}
                {isArkpassivesVisible && IsArkPassive && cleanPoints.map(({ Name, Value, Tooltip }) => (
                    <View>
                        {<TouchableOpacity onPress={() => { showPointsTooltip(Tooltip); }}>
                            <Text style={styles.text}>{Name} : {Value}</Text>
                        </TouchableOpacity>}
                    </View>
                ))}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isPointsTooltipVisible}
                    onRequestClose={closePointsTooltip}
                >
                    <TouchableWithoutFeedback onPress={closePointsTooltip}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <ScrollView>
                                        <Text style={styles.text2}>{PointsTooltip}</Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {isArkpassivesVisible && IsArkPassive && cleanEffects.map(({ Icon, Description }) => {
                    const rmHtmlDescription = removeHtmlTags(Description);
                    return(
                    <View>
                            <Text style={styles.text2}>{rmHtmlDescription}</Text>
                            <Image
                                source={{ uri: Icon }}
                                style={styles.itemImage}
                                resizeMode="cover"
                                onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                            />
                    </View>
                )})}
                {isArmoryAvatarsVisible && (<Text style={styles.text}>아바타</Text>)}
                {isArmoryAvatarsVisible && cleanArmoryAvatars.map(({ Type, Name, Icon, Grade, Tooltip }) => (
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
                {isCollectiblesVisible && (<Text style={styles.text}>아바타</Text>)}
                {isCollectiblesVisible && Collectibles.map(({ Type, Icon, Point, MaxPoint, CollectiblePoints }) => (
                    <View>
                        <TouchableOpacity onPress={() => { showCollectiblesTooltip(CollectiblePoints); }}>
                            <View style={{justifyContent: 'flex-start' , alignItems: 'stretch', flexDirection: 'row'}}>
                                <Image
                                    source={{ uri: Icon }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                    onError={(e) => console.log('이미지 로드 오류:', e.nativeEvent.error)}
                                />
                                <Text style={styles.text2}>{Type}: {Point}/{MaxPoint}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isCollectiblesTooltipVisible}
                    onRequestClose={closeCollectiblesTooltip}
                >
                    <TouchableWithoutFeedback onPress={closeCollectiblesTooltip}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>
                                    <ScrollView>
                                        <Text style={styles.text2}>{CollectiblesTooltip}</Text>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
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
    TouchableOpacityButton: {
        backgroundColor: '#151720', 
        padding: 10, 
        borderRadius: 5
    },
    LOAHUBButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default character;