import React from 'react'
import FirebaseKeys from "./config"
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Icon} from 'native-base'

import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'

import HomeScreen from './screens/HomeScreen'
import LookupScreen from './screens/LookupScreen'
import PostScreen from './screens/PostScreen'
import ProfileScreen from './screens/ProfileScreen'
import SearchScreen from './screens/SearchScreen'

const AppContainer = createStackNavigator(
  {
      default: createBottomTabNavigator(
      {
          Home: {
            screen: HomeScreen,
            navigationOptions: {
              tabBarIcon: ({tintColor}) => <Icon type="Ionicons" name = "ios-home" style = {{fontSize: 24, color: tintColor}}/>
            }
          },
          Loopkup: {
            screen: LookupScreen,
            navigationOptions: {
              tabBarIcon: ({tintColor}) =>  <Icon type="MaterialCommunityIcons" name = "feature-search-outline" style = {{fontSize: 24, color: tintColor}}/>
            }
          },
          // Search: {
          //   screen: SearchScreen,
          //   navigationOptions: {
          //     tabBarIcon: ({tintColor}) => <Icon type="MaterialCommunityIcons" name = "feature-search-outline" style = {{fontSize: 24, color: tintColor}}/>
          //   }
          // },
          Post: {
            screen: PostScreen,
            navigationOptions: {
              tabBarIcon: ({tintColor}) => (
                  <Icon 
                    type="Ionicons" 
                    name = "ios-add-circle"
                    style = {{
                            fontSize: 48, 
                            color: "#ccda46",
                            }}/>)
            }
          },
          Search: {
            screen: SearchScreen,
            navigationOptions: {
              tabBarIcon: ({tintColor}) => <Icon type="Ionicons" name = "ios-notifications" style = {{fontSize: 24, color: tintColor}}/>
            }
          },
          // Loopkup: {
          //   screen: LookupScreen,
          //   navigationOptions: {
          //     tabBarIcon: ({tintColor}) => <Icon type="Ionicons" name = "ios-notifications" style = {{fontSize: 24, color: tintColor}}/>
          //   }
          // },
          Profile: {
            screen: ProfileScreen,
            navigationOptions: {
              tabBarIcon: ({tintColor}) => <Icon type="Ionicons" name = "ios-person" style = {{fontSize: 24, color: tintColor}}/>
            }
          }
      },
      {
        defaultNavigationOptions: {
          tabBarOnPress: ({navigation, defaultHandler}) => {
            if(navigation.state.key === "Post") {
              navigation.navigate("postModal");
            }else {
              defaultHandler();
            }
          }
        },
        tabBarOptions: {
          activeTintColor: "#161F3D",
          inactiveTintColor: "#B8BBC4",
          showLabel: false
        },
        initialRouteName: "Profile"
      }
    ),
    postModal: {
        screen: PostScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none",
  }
)


const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
  },
  {
    initialRouteName: "Login",
    headerMode: 'none'
  }
)

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack
    },
    {
      intitialRouteName: "Loading"
    }
  )
)







