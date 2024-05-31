import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgqwtpmygjpbbdieaqof.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncXd0cG15Z2pwYmJkaWVhcW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2NTM5ODQsImV4cCI6MjAzMjIyOTk4NH0.WWAJO34PkmGTNXVSfsl0VXnv7xnJOv9Gbg2DDcNf5FU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


export const getAllListings = async () => {

try{
let { data: listings, error } = await supabase
  .from('listings')
  .select('*')

  return listings;
} catch (error) {

}
}

