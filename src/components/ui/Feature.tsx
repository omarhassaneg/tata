@@ .. @@
   return (
     <div className="flex items-center gap-3">
-      <div className="p-2 bg-primary-gold/10 rounded-lg text-primary-gold">
+      <div className="p-2 bg-primary-gold/10 dark:bg-white/10 rounded-lg text-primary-gold dark:text-white">
         {icon}
       </div>
-      <span className="text-sm text-gray-600">{title}</span>
+      <span className="text-sm text-gray-600 dark:text-gray-300">{title}</span>
     </div>
   );