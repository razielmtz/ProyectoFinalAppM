import React from 'react'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Icon} from 'native-base'

import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'

import EventsScreen from './screens/EventsScreen'
import ForAdoptionScreen from './screens/ForAdoptionScreen'
import PostEventScreen from './screens/PostEvent'
import PostAdoptionScreen from './screens/PostAdoption'
import ProfileScreen from './screens/ProfileScreen'
import EditProfile from './screens/EditProfile'
import SearchScreen from './screens/SearchScreen'
import CommentsScreen from './screens/CommentsScreen'
import CommentsAdoptionScreen from './screens/CommentsAdoptionScreen'


const EventsStack = createStackNavigator({
  Events: EventsScreen,
  PostComments: CommentsScreen,
  PostEvent: PostEventScreen
  },
  {
    initialRouteName: "Events",
    headerMode: 'none'
})

const AdoptionStack = createStackNavigator({
  ForAdoption: ForAdoptionScreen,
  PostAdoptionComments: CommentsAdoptionScreen,
  PostAdoption: PostAdoptionScreen
  },
  {
    initialRouteName: "ForAdoption",
    headerMode: 'none'
})

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  EditProfile: EditProfile
  },
  {
    initialRouteName: "Profile",
    headerMode: 'none'
})

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
  },
  {
    initialRouteName: "Login",
    headerMode: 'none'
})

const AppContainer = createStackNavigator(
  {
      default: createBottomTabNavigator(
      {
          Events: {
            screen: EventsStack,
            navigationOptions: {
              tabBarIcon: ({tintColor}) => <Icon type="Ionicons" name = "ios-home" style = {{fontSize: 24, color: tintColor}}/>
            }
          },
          Loopkup: {
            screen: AdoptionStack,
            navigationOptions: {
              tabBarIcon: ({tintColor}) =>  <Icon type="MaterialCommunityIcons" name = "feature-search-outline" style = {{fontSize: 24, color: tintColor}}/>
            }
          },
          // Search: {
          //   screen: SearchScreen,
          //   navigationOptions: {
          //     tabBarIcon: ({tintColor}) => <Icon type="Ionicons" name = "ios-notifications" style = {{fontSize: 24, color: tintColor}}/>
          //   }
          // },
          Profile: {
            screen: ProfileStack,
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
    // postModal: {
    //     screen: PostEventScreen
    // }
  },
  {
    mode: "modal",
    headerMode: "none",
  }
)

console.disableYellowBox = true;

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







