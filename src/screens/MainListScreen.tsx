import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
  } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RootStackParamList from '../../types/RootStackParamList';
  
  type ListScreenNAvigationProp = NativeStackNavigationProp<RootStackParamList, 'List'>;

  interface ListScreenProps {
    navigation: ListScreenNAvigationProp;
  }

  const MainListScreen: React.FC<ListScreenProps> = ({navigation}) => {
    const [data, setData] = useState([] as any[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://reqres.in/api/users?page');
          
          const result = await response.json();
          console.log(result.data)
          setData(result.data);
        } catch (error: any) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []); 
  
    if (loading) {
      return <Text>Loading...</Text>;
    }
  
    if (error) {
      return <Text>Error: {error}</Text>;
    }
  
    const itemSeparator = () => {
      return<View style= {styles.itemSeparator}/>
    }
  
    const handleItemClick = (item: any) => {
      navigation.navigate('Form')
    };
  
    const renderItem = ({ item }: { item: any }) => (
      <TouchableOpacity onPress={() =>handleItemClick(item)}>
        <View style={styles.itemStyle}>
        <Image 
        style={{height: 50, width: 50}}
        src= {item.avatar} />
        <Text style={styles.listItemStyle}>{item}</Text>
      </View>
      </TouchableOpacity>
    );
    return (
      <SafeAreaView>
        <View
          style={styles.listItemContainer}>
          <FlatList 
            data={data}
            renderItem={({item}) => <TouchableOpacity onPress={() =>handleItemClick(item)}>
            <View style={styles.itemStyle}>
            <Image 
            style={{height: 50, width: 50}}
            source= {{uri: item.avatar}} />
            <Text style={styles.listItemStyle}> {item.first_name} {item.last_name}</Text>
          </View>
          </TouchableOpacity>}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={itemSeparator}>
          </FlatList>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    itemStyle: {
      flexDirection: 'row',
      backgroundColor: 'lightgray',
      paddingBottom: 5,
      paddingTop: 5,
    },
    itemSeparator: {
      height: 1,
      backgroundColor: 'gray',
    },
    listItemContainer: {
      flexWrap: 'wrap',
      flex: 1,
      flexDirection: 'row',
    },
    listItemStyle: {
      fontSize: 18,
      fontWeight: '600',
      padding: 10,
      height: 44,
    },
  });

  export default MainListScreen;