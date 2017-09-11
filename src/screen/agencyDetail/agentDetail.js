import React, { Component } from 'react';
import {
    StyleSheet,
    Text, Image,
    Alert, TouchableHighlight,
    AsyncStorage,
    View,
    Keyboard,
    TextInput, Dimensions,
    ScrollView,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import NavigationTitle from '../../commonComponent/navBarTitle';
import {
    getAgencies,
    callAgencyActivation,
    updateAgencyActivation,
} from '../../actions/agentRegistration'
import {
    logoutUser
} from '../../actions/userAction'
import Constant from '../../helper/constant';
import Spinner from '../../helper/loader';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} =Dimensions.get('window');

class AgentDetailRow extends Component {

    render() {
        return (
            <TouchableHighlight onPress={()=>{this.props.onSelectRow(this.props.item)}}
                                underlayColor={"transparent"}>
                <View style={styles.agentView}>
                    <View style={styles.imageView}>
                        <Image onLayout={(event) => {this.setState({y: event.nativeEvent.layout.y})}}
                               source={(this.props.item.uri)? {uri: this.props.item.uri}:
                                   require('../../assets/images/avatar-male.png')} style={styles.images} />
                    </View>
                    <View style={styles.textView}>
                        <View style={{flexDirection:'row'}}>
                            <Text>{(this.props.item.firstName)? this.props.item.firstName:'N/A'}</Text>
                            <Text>{' '}</Text>
                            <Text>{(this.props.item.lastName)? this.props.item.lastName:'N/A'}</Text>
                        </View>
                        <View>
                            <Text>{(this.props.item.zoneName)? this.props.item.zoneName: 'N/A'}</Text>
                        </View>
                        <View>
                            <Text>{(this.props.item.email)? this.props.item.email:'N/A'}</Text>
                        </View>
                    </View>
                    <TouchableHighlight style={styles.moreView}
                                        onPress={()=> this.props.onActivateCall(this.props.index, this.props.item)} underlayColor={"transparent"}>
                        <View style={{margin:5}}>
                            {(this.props.item.isActive) ?
                                <Image source={require('../../assets/images/icon-quiz-tick.png')} style={{height: 30, width: 30,}}/>
                                :
                                <Image source={require('../../assets/images/icon-quiz-tick-red.png')} style={{height: 30, width: 30,}}/>
                            }
                        </View>

                    </TouchableHighlight>
                </View>
            </TouchableHighlight>
        );
    }
}

class AgentDetail extends Component {

    constructor(props){
        super(props);
        this.state={
            agencyDetail:[]
        };
    }

    onBackButtonPress = () => {
        this.props.navigator.pop();
    };

    componentDidMount(){
        // this.props.getAgencies();
    }

    onActivateCall = (index, agency) => {
        if(!agency.isActive) {
            Alert.alert("Warning!!",
                "\nAre you sure, you want to activate this agency?",
                [
                    {text: 'Yes', onPress: () => {
                        this.props.callAgencyActivation(agency._id,{isActive: true})
                            .then(res => {
                                let arr =  _.cloneDeep(this.props.agencies);
                                arr[index].isActive = true;
                                this.props.updateAgencyActivation(arr);
                            })
                            .catch(error => {
                                Alert.alert("Error","Fail to activate agency.")
                            });

                    }},
                    {text: 'No', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            );
        }
    };


    onAddAgencyCall = () => {
        if(this.props.balance != 0){
            this.props.navigator.push('agentFormPersonal');
        }else{
            Alert.alert("Error","Not able to register agency," +
                " \n please check your balance.");
        }
    };

    onSelectRow = (item) => {
        this.props.navigator.push('agentFullProfile',{userDetails: item});
    };

    renderAgents = () => {
        return this.props.agencies.map((item,index) => {
            return(
               <AgentDetailRow item={item} onSelectRow={this.onSelectRow}/>
            )
        });
    };

    onLogOut = () =>{
        AsyncStorage.clear();
        this.props.logoutUser().then(res => {
            this.props.navigator.replace('login');
        }).catch(err=>{

        })
    };

    render() {
        return (
            <View style={{flex:1,backgroundColor: '#fff'}}>
                <NavigationTitle title="Agent Detail"/>
                <View style={{height:10}}/>
                <FlatList
                     showsVerticalScrollIndicator={false}
                     removeClippedSubviews={false}
                     data={this.props.agencies}
                     renderItem={({item, index}) => <AgentDetailRow item={item}
                     index={index}
                     onSelectRow={this.onSelectRow}
                     onActivateCall={this.onActivateCall}
                     />
                    }
                />


                <View style={{position:'absolute',backgroundColor:'transparent',
                              marginTop:height-width*0.2-15, marginLeft: width-width*0.2-15}}>
                    <TouchableHighlight underlayColor="transparent"
                                        onPress={() => this.onAddAgencyCall()}
                                        style={{width:width*0.2, height:width*0.2,ackgroundColor:'transparent'}} >
                        <Image source={require('../../assets/images/plus.png')}
                               style={{ alignSelf:'center', borderRadius:30}}/>
                    </TouchableHighlight>
                </View>

                <View style={{position:'absolute', top: (Constant.IOS) ? 25 : 15, left: 25, height:30,width:30}}>
                    <TouchableHighlight underlayColor="transparent"
                                        onPress={() => this.onLogOut()}>
                        <MaterialCommunityIcons name='logout' size={30} color={"#FFF"}/>
                    </TouchableHighlight>
                </View>
                <Spinner visible={this.props.isLoading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outerView:{
        width: "90%",
        alignSelf: 'center',
        paddingTop: 20,

    },
    formTextLabel:{
        color: 'gray',
        fontSize: 15,
        fontWeight: '500',
        paddingBottom: 5,
        paddingTop: 5,
    },
    textBox: {
        color: 'gray',
        fontSize: 15,
        fontWeight: '500',
        paddingBottom: 0,
        height: 45,
        paddingLeft: 10,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 5
    },
    agentView:{
        flex:1,
        width: width-20,
        height: height*0.14,
        backgroundColor:'rgba(224,235,235,.8)',
        alignSelf:'center',
        marginLeft:10,
        marginRight:10,
        marginBottom:10,
        marginTop:0,
        flexDirection:'row',
        borderRadius:6
    },
    imageView: {
        alignSelf:'center',
        marginLeft:12
    },
    images: {
        width: height*0.1,
        height: height*0.1,
    },
    textView:{
        margin:12,
        justifyContent:'space-between',
        flex:1,
    },
    moreView:{
        marginRight:12,
        justifyContent:'center',
        alignItems:'center',
    }
});

const mapStateToProps = state => {
    return {
        agencies: state.agent.agencies,
        balance: (state.user.userDetail.Balance) ? state.user.userDetail.Balance : 0,
    };
};

export default connect(mapStateToProps, {
    getAgencies,
    callAgencyActivation,
    updateAgencyActivation,
    logoutUser
})(AgentDetail);