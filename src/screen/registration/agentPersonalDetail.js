import React, {Component} from "react";
import {StyleSheet, Text, Alert, AsyncStorage, View, Keyboard, TextInput, ScrollView} from "react-native";
import {connect} from "react-redux";
import NavigationBar from "../../commonComponent/navBar";
import Constant from "../../helper/constant";
import Button from "../../commonComponent/button";
import ErrorView from "../../commonComponent/error";
import { showAlert } from '../../services/apiCall';
import {
    fnameChanged,
    lnameChanged,
    mobileChanged,
    emailChanged,
    passwordChanged,
    usernameChanged,
    agentBirthDate,
  getBalance
} from "../../actions/agentRegistration";
import {emailValidate, phoneValidate, } from "../../actions/userAction";
import DatePicker from "../../helper/datepicker";
import moment from "moment";
import { isEmpty, isValidEmail, isOnlyAlphabets, isValidMobileNo } from '../../helper/appHelper';

class AgentFormPersonal extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedDate: '',
            isValidEmail: true,
            isValidPhoneNo: true,
            emailError: '',
            mobileError: '',
        };
    }
  componentDidMount(){
    this.props.getBalance().then((responseJSON) => console.log(responseJSON.toString())).catch((err) => console.log(err.toString()))
  }

    onNextButtonPress = () => {

        if(isEmpty(this.props.firstName) &&
            isEmpty(this.props.lastName) &&
            isEmpty(this.props.mobileNo) &&
            isEmpty(this.props.email) &&
            isEmpty(this.props.password) ) {
            if(this.state.isValidPhoneNo && this.state.isValidEmail){
                if(!isOnlyAlphabets(this.props.firstName) || !isOnlyAlphabets(this.props.lastName)) {
                    showAlert('Enter valid name');
                }else{
                    this.props.navigator.push('agentLocation');
                }
            }else{
                showAlert('Enter Data in all fields.');
            }
        }else{
            showAlert('Enter Data in all fields.');
        }
    };

    focusNextField = (nextField) => {
        this.refs[nextField].focus();
    };


    onBackButtonPress = () => {
        this.props.navigator.pop();
    };

    onPhoneNoValid = () => {
        if(isEmpty(this.props.mobileNo)) {
            if(isValidMobileNo(this.props.mobileNo)){
                this.props.phoneValidate(this.props.mobileNo.trim()).then(res => {
                    this.setState({isValidPhoneNo: true, mobileError: ''});
                }).catch(err => {
                    this.setState({isValidPhoneNo: false, mobileError: "Mobile number already exists"});
                });
            }else{
                this.setState({isValidPhoneNo: false, mobileError: "Enter valid phone number"});
            }
        }else{
            this.setState({isValidPhoneNo: false, mobileError: "Enter valid phone number"});
        }
    };

    onEmailValid = () => {
        if(isValidEmail(this.props.email)){
            this.props.emailValidate(this.props.email.trim()).then(res => {
                this.setState({isValidEmail: true, emailError: ''});
            }).catch(err => {
                this.setState({isValidEmail: false, emailError: 'Email already exists'});
            });
        }else{
            this.setState({isValidEmail: false, emailError: 'Enter valid Email Address'});
        }
    };

    render() {
        return (
            <View style={{flex:1}}>
                <NavigationBar title="Personal Detail" onBackButtonPress={this.onBackButtonPress}/>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.outerView}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:15,color:'red'}}>{"* "}</Text>
                            <Text style={styles.formTextLabel}>First Name</Text>
                        </View>
                        <TextInput  ref="txtFname"
                                    value={this.props.firstName}
                                    placeholder={"First Name"}
                                    style={ styles.textBox }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType={'next'}
                                    onChangeText={(text) => {this.props.fnameChanged(text)}}
                                    onSubmitEditing={() => this.focusNextField('txtLname')}
                                    underlineColorAndroid={Constant.transparent}
                        />
                    </View>

                    <View style={styles.outerView}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:15,color:'red'}}>{"* "}</Text>
                            <Text style={styles.formTextLabel}>Last Name</Text>
                        </View>
                        <TextInput  ref="txtLname"
                                    value={this.props.lastName}
                                    placeholder={"Last Name"}
                                    style={ styles.textBox }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType={'next'}
                                    onChangeText={(text) => {this.props.lnameChanged(text)}}
                                    onSubmitEditing={() => this.focusNextField('txtEmail')}
                                    underlineColorAndroid={Constant.transparent}
                        />
                    </View>

                    <View style={styles.outerView}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:15,color:'red'}}>{"* "}</Text>
                            <Text style={styles.formTextLabel}>Email Id</Text>
                        </View>

                        <TextInput  ref="txtEmail"
                                    keyboardType={'email-address'}
                                    value={this.props.email}
                                    placeholder={"Email"}
                                    style={ styles.textBox }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType={'next'}
                                    onChangeText={(text) => {this.props.emailChanged(text)}}
                                    onSubmitEditing={() => this.focusNextField('txtPhone')}
                                    underlineColorAndroid={Constant.transparent}
                                    onEndEditing={(text) => this.onEmailValid(text)}
                        />
                        {
                            (!this.state.isValidEmail)?
                                <ErrorView errorMessage={this.state.emailError}/>
                                :null
                        }

                    </View>

                    <View style={styles.outerView}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:15,color:'red'}}>{"* "}</Text>
                            <Text style={styles.formTextLabel}>Mobile No</Text>
                        </View>

                        <TextInput  ref="txtPhone"
                                    keyboardType={'numeric'}
                                    value={this.props.mobileNo}
                                    placeholder={"Mobile No."}
                                    style={ styles.textBox }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType={'next'}
                                    maxLength={10}
                                    onChangeText={(text) => {this.props.mobileChanged(text)}}
                                    underlineColorAndroid={Constant.transparent}
                                    onEndEditing={(text) => this.onPhoneNoValid(text)}
                        />
                        {
                            (!this.state.isValidPhoneNo)?
                                <ErrorView errorMessage={this.state.mobileError}/>
                                :null
                        }

                    </View>

                    <View style={styles.outerView}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:15,color:'red'}}>{"* "}</Text>
                            <Text style={styles.formTextLabel}>Birth Date</Text>
                        </View>
                        <DatePicker
                            style={{color: 'gray',
                                    width: '100%',
                                    fontWeight: '500',
                                    paddingBottom: 0,
                                    height: 45,
                                    paddingLeft: 10,
                                    borderWidth: 0.5,
                                    borderColor: 'gray',
                                    borderRadius: 5}}
                            date={this.props.birthDate}
                            mode='date'
                            maxDate={moment().format("DD MMM YYYY")}
                            placeholder='Select Date'
                            format='DD MMM YYYY'
                            iconSource={require('../../assets/images/expandArrow.png')}
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            onDateChange={(date) => {
                                this.props.agentBirthDate(date)
                            }}
                        />
                    </View>

                    <View style={styles.outerView}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:15,color:'red'}}>{"* "}</Text>
                            <Text style={styles.formTextLabel}>Password</Text>
                        </View>
                        <TextInput  ref="txtPassword"
                                    value={this.props.password}
                                    placeholder={"Password"}
                                    style={ styles.textBox }
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType={'done'}
                                    onChangeText={(text) => {this.props.passwordChanged(text)}}
                                    underlineColorAndroid={Constant.transparent}/>
                    </View>

                    <Button title="Next"
                            backColor={Constant.backColor}
                            color="#FFF"
                            otherStyle={{marginBottom:20}}
                            onPress={this.onNextButtonPress}/>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    outerView:{
        width: "90%",
        alignSelf: 'center',
        paddingTop: 20
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
    }
});

const mapStateToProps = state => {
    return {
        firstName: state.agent.firstName,
        lastName: state.agent.lastName,
        mobileNo: state.agent.mobileNo,
        userName: state.agent.userName,
        email: state.agent.email,
        password: state.agent.password,
        birthDate: state.agent.birthDate,
    };
};

export default connect(mapStateToProps, {
    fnameChanged,
    lnameChanged,
    mobileChanged,
    emailChanged,
    passwordChanged,
    usernameChanged,
    agentBirthDate,

    emailValidate,
    phoneValidate,
  getBalance
})(AgentFormPersonal);