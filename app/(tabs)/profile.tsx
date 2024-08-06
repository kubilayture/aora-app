import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import { getUserPosts, signOut } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import VideoCard from '@/components/VideoCard';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import InfoBox from '@/components/InfoBox';

const Profile = () => {
  const { user, setUser, setIsLoggedIn, isLoading } = useGlobalContext();
  console.log('user:::', user);

  if (isLoading) return <View>Loading...</View>;

  const { data: posts } = useAppwrite(() => getUserPosts(user?.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item => item.$id)}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.users.username}
            avatar={item.users.avatar}
            $id={item.$id}
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full items-center justify-center mt-6 mb-12 px-4'>
            <TouchableOpacity
              className='w-full items-end mb-10'
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>
            <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
              <Image
                source={{ uri: user?.avatar }}
                resizeMode='cover'
                className='w-[90%] h-[90%] rounded-lg'
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />
            <View className='mt-5 flex-row'>
              <InfoBox
                title={String(posts?.length) ?? String(0)}
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
              <InfoBox
                title={'1.5k'}
                subtitle='Followers'
                containerStyles='mr-5'
                titleStyles='text-xl'
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Videos Found'
            subtitle='No videos found for this search query'
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;