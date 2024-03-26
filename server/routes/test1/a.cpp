#include <bits/stdc++.h>
using namespace std;

int main(){
 int t;
 cin >> t;
 while(t--){
 	int n;
 	cin >> n;
   int ans = 0;
 	for (int i = 0; i < n; ++i)
 	{
 		int a; 
 		cin >> a;
 		ans += a-1;
 	}
 	cout << ans << endl;
 }
}