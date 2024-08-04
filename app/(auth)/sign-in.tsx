import { Alert, Image, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/images';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { signIn } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

const SignIn = () => {
  const { setUser, setIsLoggedIn, user } = useGlobalContext();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (user) router.replace('/home');
  }, []);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
    }
    setIsSubmitting(true);
    try {
      const { email, password } = form;
      const result = signIn(email, password);
      setUser(result);
      setIsLoggedIn(true);

      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Error', error);
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
          <Image
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />
          <Text className='text-2xl text-white font-semibold mt-10 font-psemibold'>
            Log in to Aora
          </Text>
          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />
          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />
          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have an account?
            </Text>
            <Link className='text-lg font-psemibold text-secondary' href={'/sign-up'}>
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;