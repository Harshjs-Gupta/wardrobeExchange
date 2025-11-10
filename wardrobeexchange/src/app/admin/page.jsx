"use client";
import {
  Shield,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export default function AdminPage() {
  const pendingItems = [
    {
      id: 1,
      title: "Blue Denim Jacket",
      uploader: "Alice",
      date: "2 hours ago",
      category: "Outerwear",
    },
    {
      id: 2,
      title: "Red Summer Dress",
      uploader: "Bob",
      date: "1 day ago",
      category: "Dresses",
    },
    {
      id: 3,
      title: "Green Hoodie",
      uploader: "Charlie",
      date: "3 days ago",
      category: "Outerwear",
    },
  ];

  const reportedItems = [
    {
      id: 4,
      title: "Old T-shirt",
      uploader: "SpamUser",
      date: "1 week ago",
      reason: "Spam",
      category: "Tops",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="btn-hover inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </a>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400">
                Moderate and manage community content
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Items */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">
                Pending Items
              </h2>
              <span className="ml-auto px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-sm">
                {pendingItems.length}
              </span>
            </div>

            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="hover-lift bg-gray-700/30 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-gray-400 text-sm">
                        by {item.uploader} • {item.date}
                      </p>
                      <p className="text-gray-500 text-xs">{item.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn-hover w-8 h-8 bg-green-600/20 border border-green-500/30 rounded-lg flex items-center justify-center hover:bg-green-600/30 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </button>
                      <button
                        className="btn-hover w-8 h-8 bg-red-600/20 border border-red-500/30 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reported Items */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">
                Reported Items
              </h2>
              <span className="ml-auto px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm">
                {reportedItems.length}
              </span>
            </div>

            <div className="space-y-4">
              {reportedItems.map((item) => (
                <div
                  key={item.id}
                  className="hover-lift bg-gray-700/30 rounded-xl p-4 border-l-4 border-red-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-gray-400 text-sm">
                        by {item.uploader} • {item.date}
                      </p>
                      <p className="text-gray-500 text-xs">{item.category}</p>
                      <p className="text-red-400 text-xs mt-1">
                        Reason: {item.reason}
                      </p>
                    </div>
                    <button
                      className="btn-hover w-8 h-8 bg-red-600/20 border border-red-500/30 rounded-lg flex items-center justify-center hover:bg-red-600/30 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">1,234</div>
            <div className="text-gray-400">Total Items</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">567</div>
            <div className="text-gray-400">Approved Today</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">23</div>
            <div className="text-gray-400">Rejected Today</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">89</div>
            <div className="text-gray-400">Active Users</div>
          </div>
        </div>
      </div>
    </div>
  );
}
