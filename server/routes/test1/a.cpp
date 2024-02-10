/*
Look back, look forth, look close, 
there may be more prosperous times, 
more intelligent times, more spiritual times, 
more magical times, and more happy times, 
but this one, 
this small moment in the history of the universe, 
this is ours. 
And let’s do everything with it. Everything.
*/
#include <bits/stdc++.h>
using namespace std;
#ifdef DEBUG
#include</home/nubskr/debug.h>
#else
#define deb(...) 44
#define debv(a) 44
#endif
#define int long long

int32_t main(){ios::sync_with_stdio(0); cin.tie(0); // Use functions above this
auto solve = [&](int t) {
  int a,b;
  cin >> a >> b;
  cout << a+b;
  if(t!=0){
    cout << endl; // doesnt even run
  }
};

int t = 1;
cin >> t;

while(t--){solve(t);}
cerr << "\nTime: " << 1000 * clock() / CLOCKS_PER_SEC << "ms\n";
}
